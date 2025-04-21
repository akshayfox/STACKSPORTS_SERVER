const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { AppError } = require('../utils/errorHandler');

const createUser = async (req, res, next) => {
  try {
    const { username, password, role, ...userData } = req.body;
    
    if (!username) {
      throw new AppError("Username (email) is required", 400);
    }
    if (!password) {
      throw new AppError("Password is required", 400);
    }
    if (!['client', 'group'].includes(role)) {
      throw new AppError("Invalid role specified", 400);
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      username,
      password: hashedPassword,
      role,
      ...userData,
      createdBy: req.userId,
    }).save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully`,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query)
      .populate('template', 'name')
      .populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('template', 'name')
      .populate('createdBy', 'username');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getGroupByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    
    if (!clientId) {
      throw new AppError('Client ID is required', 400);
    }

    const users = await User.find({ client: clientId, role: 'group' }).exec();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getGroupByClientId
};