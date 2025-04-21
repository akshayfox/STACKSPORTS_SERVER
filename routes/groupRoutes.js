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
// router.use(verifyToken);
router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

module.exports = router;