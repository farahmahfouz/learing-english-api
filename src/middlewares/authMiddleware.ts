import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/userModel';
import { AppError } from '../utils/appError';

interface AuthRequest extends Request {
    user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('Please log in to get access', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { id: string };
        const user = await User.findById(decoded.id);

        if (!user) return next(new AppError('User not found', 404));

        // افترض ان User عنده method changedPasswordAfter
        //   if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
        //     return next(new AppError('Password changed recently, please login again!', 401));
        //   }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const protectTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You are not authorized to access this resource', 403));
        }
        next();
    };
};