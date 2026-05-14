import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only register for an event once (unless cancelled and re-registering logic is handled elsewhere)
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
