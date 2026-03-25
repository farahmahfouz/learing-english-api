import mongoose from 'mongoose';

const shadowingSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true,
    },
    audioUrl: {
        type: String,
    },
    selfEvaluation: {
        type: String,
        enum: ['correct', 'incorrect'],
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

shadowingSessionSchema.index({ user: 1, story: 1 }, { unique: true });

const ShadowingSession = mongoose.model('ShadowingSession', shadowingSessionSchema);
export default ShadowingSession;