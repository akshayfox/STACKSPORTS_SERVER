const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // Unique username for the user
      trim: true, // Trim whitespace
      unique: true, // Ensure username is unique
    },
    email: {
      type: String,
      unique: true, 
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['super_admin', 'client','group'], // User role, default is 'user'
      default: 'super_admin',
    },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
