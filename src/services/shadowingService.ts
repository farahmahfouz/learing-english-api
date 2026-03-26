import Story from '../models/storyModel';
import ShadowingSession from '../models/shadowingSessionModel';
import { maybeIssueCompletionCertificateService } from './certificateService';

export const getAllStoriesService = async () => {
    const stories = await Story.find().sort({ order: 1 });
    return stories;
};

export const submitShadowingService = async ({
    userId,
    storyId,
    selfEvaluation,
}: {
    userId: string;
    storyId: string;
    selfEvaluation: 'correct' | 'incorrect';
}) => {
    const session = await ShadowingSession.findOneAndUpdate(
        { user: userId, story: storyId },
        { selfEvaluation, completedAt: new Date() },
        { upsert: true, new: true }
    );

    if (selfEvaluation === 'correct') {
        // If the user completed all shadowing stories, auto-issue a certificate.
        await maybeIssueCompletionCertificateService({ userId, course: 'shadowing' });
    }

    return session;
};

export const getMyShadowingProgressService = async (userId: string) => {
    const sessions = await ShadowingSession.find({ user: userId })
        .populate('story', 'title order')
        .sort({ createdAt: 1 });

    const completed = sessions.filter(s => s.selfEvaluation === 'correct').length;

    return { sessions, completed };
};