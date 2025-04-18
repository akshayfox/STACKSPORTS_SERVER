const express = require('express');
const { 
  createGroup, 
  getGroups, 
  getGroupById, 
  updateGroup, 
  deleteGroup 
} = require('../controllers/groupController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

// Apply authentication middleware to all group routes
router.use(verifyToken);

// Create a new group
router.post('/', createGroup);

// Get all groups with optional filtering
router.get('/', getGroups);

// Get a single group by ID
router.get('/:id', getGroupById);

// Update a group
router.put('/:id', updateGroup);

// Delete a group
router.delete('/:id', deleteGroup);

module.exports = router;