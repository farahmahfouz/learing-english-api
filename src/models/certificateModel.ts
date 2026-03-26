import mongoose from 'mongoose';

export type CertificateCourse = 'levels' | 'shadowing';

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: String,
      enum: ['levels', 'shadowing'],
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issuedAt: {
      type: Date,
      required: true,
    },
    totalUnits: {
      // total levels or total stories
      type: Number,
      required: true,
    },
    completedUnits: {
      // completed levels or completed correct stories
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;

