import express from 'express';
import { getMyProgress, submitLevelQuiz } from '../controllers/progressController';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(auth);

router.post('/submit-quiz', submitLevelQuiz);
router.get('/me', getMyProgress);

export default router;