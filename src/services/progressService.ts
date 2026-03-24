// services/progressService.ts
import Progress from '../models/progressModel';
import User from '../models/userModel';

interface UpdateProgressInput {
    userId: string;
    levelId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    quizScore?: number;
}

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
        { upsert: true, new: true }
    );

    if (status === 'completed') {
        await User.findByIdAndUpdate(userId, {
            $addToSet: { completedLevels: levelId },
        });
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