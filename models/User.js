const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['super_admin', 'client', 'group'],
      default: 'super_admin',
    },
    fullname: {
      type: String,
      trim: true,
    },
    place: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      match: [/^\d{10}$/, 'Please use a valid 10-digit phone number.'],
    },
    grouptitle: {
      type: String,
      trim: true,
    },
    subGroupTitle: {
      type: String,
      trim: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
