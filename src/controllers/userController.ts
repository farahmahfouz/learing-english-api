import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendToken } from '../utils/sendToken';
import { signupUser, loginUser } from '../services/userService';
import { AppError } from '../utils/appError';

export const signup = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new AppError('Please provide name, email, and password', 400);
    }

    const user = await signupUser({ name, email, password });
    sendToken(user, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    const user = await loginUser({ email, password });
    sendToken(user, 200, res);
});
