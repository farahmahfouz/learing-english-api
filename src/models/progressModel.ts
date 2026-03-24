import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true,
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
    },
    quizScore: {
        type: Number,
        default: 0,
    },
    completedAt: {
        type: Date,
    },
}, { timestamps: true });

progressSchema.index({ user: 1, level: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;