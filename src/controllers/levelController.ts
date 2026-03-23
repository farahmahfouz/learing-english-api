import { Request, Response } from 'express';
import { catchAsync } from "../utils/catchAsync";
import { createLevelService, getLevelByIdService, getAllLevelsService } from '../services/levelService';
import { AppError } from '../utils/appError';


export const createLevel = catchAsync(async (req: Request, res: Response) => {
    const level = await createLevelService(req.body);
    res.status(201).json({
        status: 'success',
        data: { level }
    });
});

export const getAllLevels = catchAsync(async (req: Request, res: Response) => {
    const levels = await getAllLevelsService();
    res.status(200).json({
        status: 'success',
        data: { levels }
    });
});

export const getLevelById = catchAsync(async (req: Request, res: Response) => {
     const level = await getLevelByIdService(req.params.id as string);
    if (!level) throw new AppError('Level not found', 404);
    res.status(200).json({
        status: 'success',
        data: { level }
    });
});