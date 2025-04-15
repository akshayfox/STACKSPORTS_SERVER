const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing the password
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Check if super admin exists using username instead of email
    const existingUser = await User.findOne({ username: 'superadmin@gmail.com' });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const superAdmin = new User({
        username: 'superadmin@gmail.com',
        password: hashedPassword,
        role: 'super_admin',
      });
      await superAdmin.save();
      console.log('Super Admin created successfully');
    } else {
      console.log('Super Admin already exists');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;