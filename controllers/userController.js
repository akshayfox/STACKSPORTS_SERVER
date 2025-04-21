const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { username, password, role, ...userData } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username (email) is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!['client', 'group'].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    const user =await new User({
      username,
      password,
      role,
      ...userData,
      createdBy: req.userId,
    }).save();
    console.log('working')
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully`,
      data: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};


const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query)
      .populate('template', 'name')
      .populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      data:users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('template', 'name')
      .populate('createdBy', 'username');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
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
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};


const getGroupByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const users = await User.find({ client: clientId, role: 'group' })
      .exec();
    return res.status(200).json({
      success: true,
      count: users.length,
      data:users,
    });
  } catch (error) {
    console.error('Error fetching users by clientId and role:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
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