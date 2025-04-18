const Group = require('../models/Group');

// Create a new group
const createGroup = async (req, res) => {
  try {
    const groupData = req.body;
    
    // Add the user ID from the authenticated request
    groupData.user = req.userId;
    
    const group = new Group(groupData);
    await group.save();
    
    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating group",
      error: error.message
    });
  }
};

// Get all groups with optional filtering
const getGroups = async (req, res) => {
  try {
    const { userId, clientId } = req.query;
    let query = {};
    
    // Filter by user if provided
    if (userId) {
      query.user = userId;
    }
    
    // Filter by client if provided
    if (clientId) {
      query.client = clientId;
    }
    
    const groups = await Group.find(query)
      .populate('client', 'fullname place')
      .populate('user', 'username');
      
    return res.status(200).json({
      success: true,
      count: groups.length,
      groups
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching groups",
      error: error.message
    });
  }
};

// Get a single group by ID
const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await Group.findById(id)
      .populate('client', 'fullname place')
      .populate('user', 'username');
      
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      group
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching group",
      error: error.message
    });
  }
};

// Update a group
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find the group first to check if it exists
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }
    
    // Optional: Check if the user is authorized to update this group
    if (group.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this group"
      });
    }
    
    // Update the group
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('client', 'fullname place')
     .populate('user', 'username');
    
    return res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: updatedGroup
    });
  } catch (error) {
    console.error("Error updating group:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating group",
      error: error.message
    });
  }
};

// Delete a group
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the group first to check if it exists
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }
    
    // Optional: Check if the user is authorized to delete this group
    if (group.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this group"
      });
    }
    
    await Group.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: "Group deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting group",
      error: error.message
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup
};