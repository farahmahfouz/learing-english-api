import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendToken } from '../utils/sendToken';
import { signupUser, loginUser, getUser } from '../services/userService';
import { AppError } from '../utils/appError';

interface AuthRequest extends Request {
    user?: { id?: string; _id?: unknown };
}

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

export const getOneUser = catchAsync(async (req: Request, res: Response) => {
    const user = await getUser(req.params.id as string);

    res.status(200).json({
      status: 'success',
      message: 'User found successfully',
      data: { user },
    });
  });


  export const getMe = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError('Please log in to get access', 401));
    }
    const id = String(req.user._id ?? req.user.id ?? '');
    if (!id) {
        return next(new AppError('Please log in to get access', 401));
    }
    (req.params as Record<string, string | string[]>).id = id;
    next();
};