import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import Level from '../models/levelModel';
import Progress from '../models/progressModel';
import Story from '../models/storyModel';
import ShadowingSession from '../models/shadowingSessionModel';
import User from '../models/userModel';
import Certificate, { type CertificateCourse } from '../models/certificateModel';

const COURSE_TITLES: Record<CertificateCourse, string> = {
  levels: 'Course Levels Completion',
  shadowing: 'Shadowing Stories Completion',
};

const generateVerificationCode = (): string => {
  // 4-4 hex chars => e.g. "A1B2-C3D4"
  const raw = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
};

const generatePdfBuffer = ({
  userName,
  course,
  verificationCode,
  completedAt,
}: {
  userName: string;
  course: CertificateCourse;
  verificationCode: string;
  completedAt: Date;
}) => {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(20).text('Completion Certificate', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).text(COURSE_TITLES[course], { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).text(`This certifies that:`, { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(16).text(userName, { align: 'left' });
    doc.moveDown(1.2);

    doc.fontSize(12).text('Verification code:', { align: 'left' });
    doc.moveDown(0.1);
    doc.fontSize(18).text(verificationCode, { align: 'left' });
    doc.moveDown(1.2);

    doc.fontSize(12).text(`Completed at: ${completedAt.toDateString()}`, { align: 'left' });

    doc.moveDown(2);
    doc.fontSize(10).fillColor('gray').text('To verify this certificate, use the verification code.', {
      align: 'left',
    });

    doc.end();
  });
};

export const maybeIssueCompletionCertificateService = async ({
  userId,
  course,
}: {
  userId: string;
  course: CertificateCourse;
}) => {
  const existing = await Certificate.findOne({ user: userId, course });
  if (existing) return existing;

  if (course === 'levels') {
    const levels = await Level.find().select('_id levelNumber').sort({ levelNumber: 1 });
    const totalUnits = levels.length;
    if (totalUnits === 0) return null;

    const levelIds = levels.map((l) => l._id);
    const completedUnits = await Progress.countDocuments({
      user: userId,
      level: { $in: levelIds },
      status: 'completed',
    });

    if (completedUnits !== totalUnits) return null;

    const latest = await Progress.find(
      {
        user: userId,
        level: { $in: levelIds },
        status: 'completed',
      },
      { completedAt: 1 }
    )
      .sort({ completedAt: -1 })
      .limit(1);

    const completedAt = latest[0]?.completedAt ?? new Date();

    // Ensure we don't collide with existing verification codes.
    for (let attempt = 0; attempt < 5; attempt++) {
      const verificationCode = generateVerificationCode();
      try {
        const created = await Certificate.create({
          user: userId,
          course,
          verificationCode,
          issuedAt: completedAt,
          totalUnits,
          completedUnits,
        });
        return created;
      } catch (err: unknown) {
        // Duplicate key => try again with a new code.
        const e = err as { code?: number };
        if (e?.code === 11000) continue;
        throw err;
      }
    }

    // Extremely unlikely.
    throw new Error('Could not generate a unique verification code');
  }

  // course === 'shadowing'
  const stories = await Story.find().select('_id order').sort({ order: 1 });
  const totalUnits = stories.length;
  if (totalUnits === 0) return null;

  const storyIds = stories.map((s) => s._id);
  const completedUnits = await ShadowingSession.countDocuments({
    user: userId,
    story: { $in: storyIds },
    selfEvaluation: 'correct',
  });

  if (completedUnits !== totalUnits) return null;

  const latest = await ShadowingSession.find(
    {
      user: userId,
      story: { $in: storyIds },
      selfEvaluation: 'correct',
    },
    { completedAt: 1 }
  )
    .sort({ completedAt: -1 })
    .limit(1);

  const completedAt = latest[0]?.completedAt ?? new Date();

  for (let attempt = 0; attempt < 5; attempt++) {
    const verificationCode = generateVerificationCode();
    try {
      const created = await Certificate.create({
        user: userId,
        course,
        verificationCode,
        issuedAt: completedAt,
        totalUnits,
        completedUnits,
      });
      return created;
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e?.code === 11000) continue;
      throw err;
    }
  }

  throw new Error('Could not generate a unique verification code');
};

export const getMyCertificateService = async ({
  userId,
  course,
}: {
  userId: string;
  course: CertificateCourse;
}) => {
  const certificate = await Certificate.findOne({ user: userId, course });
  return certificate;
};

export const getCertificateByVerificationCodeService = async (verificationCode: string) => {
  return Certificate.findOne({ verificationCode }).populate('user', 'name email');
};

export const issuePdfForCertificateService = async ({
  userId,
  course,
}: {
  userId: string;
  course: CertificateCourse;
}) => {
  const certificate = await maybeIssueCompletionCertificateService({ userId, course });
  if (!certificate) return null;

  const user = await User.findById(userId).select('name');
  if (!user) return null;

  const pdfBuffer = await generatePdfBuffer({
    userName: user.name,
    course,
    verificationCode: certificate.verificationCode,
    completedAt: certificate.issuedAt,
  });

  return { certificate, pdfBuffer };
};

