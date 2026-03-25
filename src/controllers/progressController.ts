import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import {
    updateProgressService,
    getMyProgressService,
    submitLevelQuizService,
} from '../services/progressService';

interface AuthRequest extends Request {
    user?: { _id: string | unknown };
}

export const submitLevelQuiz = catchAsync(async (req: AuthRequest, res: Response) => {
    const { levelId, answers } = req.body;

    if (!levelId || !answers) {
        throw new AppError('Please provide levelId and answers', 400);
    }

    const result = await submitLevelQuizService({
        userId: String(req.user?._id),
        levelId,
        answers,
    });

    res.status(200).json({
        status: 'success',
        data: result
    });
});

export const updateProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const { levelId, status, quizScore } = req.body;

    if (!levelId || !status) {
        throw new AppError('Please provide levelId and status', 400);
    }

    if (!req.user?._id) {
        throw new AppError('Please log in to get access', 401);
    }

    const progress = await updateProgressService({
        userId: String(req.user._id),
        levelId,
        status,
        quizScore,
    });

    res.status(200).json({
        status: 'success',
        data: { progress }
    });
});

export const getMyProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
        throw new AppError('Please log in to get access', 401);
    }

    const progress = await getMyProgressService(String(req.user._id));

    res.status(200).json({
        status: 'success',
        data: { progress }
    });
});