import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import {
  getCertificateByVerificationCodeService,
  getMyCertificateService,
  issuePdfForCertificateService,
  maybeIssueCompletionCertificateService,
} from '../services/certificateService';
import type { CertificateCourse } from '../models/certificateModel';

interface AuthRequest extends Request {
  user?: { _id: string | unknown };
}

const parseCourse = (value: unknown): CertificateCourse => {
  const normalized = Array.isArray(value) ? value[0] : value;
  if (normalized === 'levels' || normalized === 'shadowing') return normalized;
  return 'levels';
};

export const issueCertificate = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = String(req.user?._id);
  const course = parseCourse(req.body?.course);

  if (!userId || userId === 'undefined') {
    throw new AppError('Please log in to issue a certificate', 401);
  }

  const certificate = await maybeIssueCompletionCertificateService({ userId, course });
  if (!certificate) {
    throw new AppError('Complete the full path first to issue the certificate', 400);
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
      verificationCode: certificate.verificationCode,
      issuedAt: certificate.issuedAt,
      totalUnits: certificate.totalUnits,
      completedUnits: certificate.completedUnits,
    },
  });
});

export const getMyCertificate = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = String(req.user?._id);
  const course = parseCourse(req.query?.course);

  if (!userId || userId === 'undefined') {
    throw new AppError('Please log in to get access', 401);
  }

  const certificate = await getMyCertificateService({ userId, course });
  if (!certificate) {
    throw new AppError('Certificate not issued yet', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
      verificationCode: certificate.verificationCode,
      issuedAt: certificate.issuedAt,
      totalUnits: certificate.totalUnits,
      completedUnits: certificate.completedUnits,
    },
  });
});

export const downloadCertificatePdf = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = String(req.user?._id);
  const course = parseCourse(req.query?.course);

  if (!userId || userId === 'undefined') {
    throw new AppError('Please log in to get access', 401);
  }

  const result = await issuePdfForCertificateService({ userId, course });
  if (!result) {
    throw new AppError('Certificate not available (complete the full path first)', 404);
  }

  const { certificate, pdfBuffer } = result;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.verificationCode}.pdf"`);
  res.status(200).send(pdfBuffer);
});

export const verifyCertificate = catchAsync(async (req: Request, res: Response) => {
  const verificationCode = String(req.params.code ?? '').trim();
  if (!verificationCode) throw new AppError('Please provide a verification code', 400);

  const certificate = await getCertificateByVerificationCodeService(verificationCode);
  if (!certificate) {
    return res.status(200).json({
      status: 'success',
      data: { valid: false },
    });
  }

  const user = certificate.user as unknown as { name?: string } | null;

  res.status(200).json({
    status: 'success',
    data: {
      valid: true,
      course: certificate.course,
      verificationCode: certificate.verificationCode,
      issuedAt: certificate.issuedAt,
      studentName: user?.name ?? null,
    },
  });
});

