import express from 'express';
import {
    getPlacementQuestions,
    submitPlacementTest,
} from '../controllers/placementController';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', auth, getPlacementQuestions);
router.post('/submit', auth, submitPlacementTest);

export default router;