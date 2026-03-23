// routes/levelRoutes.ts
import express from 'express';
import { createLevel, getAllLevels, getLevelById } from '../controllers/levelController';
import { auth, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', auth, getAllLevels);
router.get('/:id', auth, getLevelById);
router.post('/', auth, restrictTo('admin'), createLevel);

export default router;