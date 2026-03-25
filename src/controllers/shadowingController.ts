import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import {
    getAllStoriesService,
    submitShadowingService,
    getMyShadowingProgressService,
} from '../services/shadowingService';
import { uploadAudio } from '../utils/uploadToCloudinary';

interface AuthRequest extends Request {
    user?: { _id: string | unknown };
}

export const getAllStories = catchAsync(async (req: Request, res: Response) => {
    const stories = await getAllStoriesService();
    res.status(200).json({
        status: 'success',
        results: stories.length,
        data: { stories }
    });
});

export const submitShadowing = catchAsync(async (req: AuthRequest, res: Response) => {
    const { storyId, selfEvaluation } = req.body;

    if (!req.file) {
        throw new AppError('Please upload audio file', 400);
    }

    const result: any = await uploadAudio(req.file.buffer);

    const session = await submitShadowingService({
        userId: String(req.user?._id),
        storyId,
        selfEvaluation,
    });

    session.audioUrl = result.secure_url;
    await session.save();

    res.status(200).json({
        status: 'success',
        data: { session }
    });
});

export const getMyShadowingProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const progress = await getMyShadowingProgressService(String(req.user?._id));
    res.status(200).json({
        status: 'success',
        data: progress
    });
});