import jwt from 'jsonwebtoken';
import { CookieOptions, Response } from 'express';
import { AppError } from './appError';

export const signToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError('JWT_SECRET is not configured', 500);
    }
    return jwt.sign({ id: userId }, secret, { expiresIn: '90d' });
};

type UserLike = {
    _id: unknown;
    password?: string;
    toObject?: () => Record<string, unknown>;
};

export const sendToken = (user: UserLike, statusCode: number, res: Response) => {
    const token = signToken(String(user._id));

    const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    };

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};
