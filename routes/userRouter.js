const express = require('express');
const { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');
const { getGroupByClientId } = require('../controllers/groupController');

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Create user (client or group)
router.post('/', createUser);

// Get users with optional role filter
router.get('/', getUsers);

// Get a single user by ID
router.get('/:id', getUserById);


// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

router.get('/client/:clientId', getGroupByClientId);


module.exports = router;