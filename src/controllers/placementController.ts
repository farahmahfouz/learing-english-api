import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import {
    getPlacementQuestionsService,
    submitPlacementTestService,
} from '../services/placementService';

interface AuthRequest extends Request {
    user?: { _id: string | unknown };
}

export const getPlacementQuestions = catchAsync(async (req: Request, res: Response) => {
    const questions = await getPlacementQuestionsService();

    res.status(200).json({
        status: 'success',
        data: { questions }
    });
});

export const submitPlacementTest = catchAsync(async (req: AuthRequest, res: Response) => {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        throw new AppError('Please provide answers array', 400);
    }

    if (!req.user?._id) {
        throw new AppError('Please log in to get access', 401);
    }

    const result = await submitPlacementTestService({
        userId: String(req.user._id),
        answers,
    });

    res.status(200).json({
        status: 'success',
        data: result
    });
});