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
router.use(verifyToken);
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/client/:clientId', getGroupByClientId);


module.exports = router;