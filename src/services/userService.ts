import User from '../models/userModel';
import { AppError } from '../utils/appError';

type UserWithPasswordCheck = {
    correctPassword: (candidate: string) => Promise<boolean>;
};

export interface SignupInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export const signupUser = async (input: SignupInput) => {
    const user = await User.create({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
    });
    return user;
};

export const loginUser = async (input: LoginInput) => {
    const { email, password } = input;
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

    if (!user || !(await (user as unknown as UserWithPasswordCheck).correctPassword(password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    return user;
};
