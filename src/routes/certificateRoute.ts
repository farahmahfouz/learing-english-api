import express from 'express';
import { auth } from '../middlewares/authMiddleware';
import {
  downloadCertificatePdf,
  getMyCertificate,
  issueCertificate,
  verifyCertificate,
} from '../controllers/certificateController';

const router = express.Router();

router.post('/issue', auth, issueCertificate);
router.get('/me', auth, getMyCertificate);
router.get('/me/pdf', auth, downloadCertificatePdf);

router.get('/verify/:code', verifyCertificate);

export default router;

