const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Table number is required'],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 1,
      max: 20,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
    reservedBy: {
      type: String,
      trim: true,
      default: '',
    },
    reservedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

tableSchema.index({ status: 1 });

module.exports = mongoose.model('Table', tableSchema);
