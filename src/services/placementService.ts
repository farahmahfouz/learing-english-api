import Level from '../models/levelModel';
import User from '../models/userModel';

interface Answer {
    questionId: string;
    levelNumber: number;
    selectedAnswer: string;
}

export const getPlacementQuestionsService = async () => {
    const levels = await Level.find().select('levelNumber quiz');

    const questions = levels.flatMap(level =>
        level.quiz.slice(0, 2).map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options,
            levelNumber: level.levelNumber,
        }))
    );

    return questions;
};

export const submitPlacementTestService = async ({
    userId,
    answers,
}: {
    userId: string;
    answers: Answer[];
}) => {
    const levels = await Level.find().select('levelNumber quiz');

    const levelScores: Record<number, { correct: number; total: number }> = {};

    for (let i = 1; i <= 7; i++) {
        levelScores[i] = { correct: 0, total: 0 };
    }

    for (const answer of answers) {
        const level = levels.find(l => l.levelNumber === answer.levelNumber);
        if (!level) continue;

        const question = level.quiz.find(
            q => q._id.toString() === answer.questionId
        );
        if (!question) continue;

        levelScores[answer.levelNumber].total++;

        if (question.correctAnswer === answer.selectedAnswer) {
            levelScores[answer.levelNumber].correct++;
        }
    }

    let assignedLevel = 1;
    for (let i = 1; i <= 7; i++) {
        const score = levelScores[i];
        if (score.total === 0) continue;
        const percentage = (score.correct / score.total) * 100;
        if (percentage >= 70) {
            assignedLevel = i + 1 <= 7 ? i + 1 : 7;
        } else {
            break;
        }
    }

    await User.findByIdAndUpdate(userId, { currentLevel: assignedLevel, hasCompletedPlacementTest: true }, { new: true, runValidators: true });

    return {
        assignedLevel,
        levelScores,
    };
};