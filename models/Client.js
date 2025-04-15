const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please use a valid 10-digit phone number.'],
    },
    grouptitle: {
      type: String,
      required: true,
      trim: true
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', ClientSchema);