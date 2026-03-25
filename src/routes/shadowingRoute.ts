import express from 'express';
import {
    getAllStories,
    submitShadowing,
    getMyShadowingProgress,
} from '../controllers/shadowingController';
import { auth } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

router.use(auth);

router.get('/stories', getAllStories);
router.get('/progress', getMyShadowingProgress);
router.post('/submit', upload.single('audio'), submitShadowing);

export default router;