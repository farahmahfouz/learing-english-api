import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false,
    },
    currentLevel: {
        type: Number,
        default: 0
    },
    isSubScribed: Boolean,
    progress: {
        type: Number,
        default: 0,
    },
    hasCompletedPlacementTest: {
        type: Boolean,
        default: false,
    },
    completedLevels: [Number],
}, { timestamps: true });

// Mongoose 9: pre('save') passes SaveOptions as 2nd arg, not next(). Use async without next.
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password as string);
};

const User = mongoose.model('User', userSchema);

export default User;