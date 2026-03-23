import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middlewares/errorMiddleware';


import userRouter from './routes/userRoute';
import levelRouter from './routes/levelRoute';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Quiz API!');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/levels', levelRouter);

app.use(globalErrorHandler);

export { app };
