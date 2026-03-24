import express from 'express';
import { updateProgress, getMyProgress } from '../controllers/progressController';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(auth);

router.get('/me', getMyProgress);
router.post('/update', updateProgress);

export default router;