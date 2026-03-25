import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    audioUrl: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
        unique: true,
    },
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
export default Story;