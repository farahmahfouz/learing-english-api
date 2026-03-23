import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/appError';

/** MongoDB duplicate key errors use numeric code 11000 (not on Mongoose ValidationError typings). */
type MongoDuplicateLike = {
    code?: number;
    keyValue?: Record<string, string>;
};

export const globalErrorHandler = (
    err: Error & { statusCode?: number; status?: string; code?: number; keyValue?: Record<string, string> },
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let error = err;
    let statusCode = err.statusCode ?? 500;
    let message = err.message;

    if (error.name === 'ValidationError' && error instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(error.errors)
            .map((e) => e.message)
            .join('. ');
    }

    const mongoErr = error as MongoDuplicateLike;
    if (mongoErr.code === 11000) {
        statusCode = 400;
        const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field';
        message = `Duplicate ${field}. Please use another value.`;
    }

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }

    res.status(statusCode).json({
        status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
