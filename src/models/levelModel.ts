import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
    levelNumber: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    sentences: [{
        text: { type: String, required: true },
        translation: { type: String, required: true },
        audioUrl: String,
    }],
    quiz: [{
        question: { type: String, required: true },
        options: [String],
        correctAnswer: { type: String, required: true },
    }],
}, { timestamps: true })

const Level = mongoose.model('Level', levelSchema);

export default Level;