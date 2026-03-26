import Progress from '../models/progressModel';
import User from '../models/userModel';
import Level from '../models/levelModel';
import { maybeIssueCompletionCertificateService } from './certificateService';

interface UpdateProgressInput {
    userId: string;
    levelId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    quizScore?: number;
}

export const submitLevelQuizService = async ({
    userId,
    levelId,
    answers,
}: {
    userId: string;
    levelId: string;
    answers: { questionId: string; selectedAnswer: string }[];
}) => {
    const level = await Level.findById(levelId);
    if (!level) throw new Error('Level not found');

    let correct = 0;
    for (const answer of answers) {
        const question = level.quiz.find(
            q => q._id.toString() === answer.questionId
        );
        if (question && question.correctAnswer === answer.selectedAnswer) {
            correct++;
        }
    }

    const quizScore = Math.round((correct / level.quiz.length) * 100);
    const status = quizScore >= 70 ? 'completed' : 'in_progress';

    const progress = await updateProgressService({
        userId,
        levelId,
        status,
        quizScore,
    });

    if (status === 'completed') {
        await User.findByIdAndUpdate(userId, {
            $inc: { currentLevel: 1 },
        });
    }

    return { progress, quizScore, status, passed: status === 'completed' };
};

export const updateProgressService = async ({
    userId,
    levelId,
    status,
    quizScore,
}: UpdateProgressInput) => {
    const progress = await Progress.findOneAndUpdate(
        { user: userId, level: levelId },
        {
            status,
            quizScore,
            completedAt: status === 'completed' ? new Date() : undefined,
        },
        {
            upsert: true,
            returnDocument: 'after',
            runValidators: true,
        }
    );

    if (status === 'completed') {
        await User.findByIdAndUpdate(userId, {
            $addToSet: { completedLevels: levelId },
        });

        // If the user completed all course levels, auto-issue a certificate.
        await maybeIssueCompletionCertificateService({ userId, course: 'levels' });
    }

    return progress;
};

export const getMyProgressService = async (userId: string) => {
    const progress = await Progress.find({ user: userId })
        .populate('level', 'levelNumber title')
        .sort({ createdAt: 1 });

    const completed = progress.filter(p => p.status === 'completed').length;
    const percentage = Math.round((completed / 7) * 100);

    return { progress, percentage };
};