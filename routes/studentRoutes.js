const express = require('express');
const { 
  createStudentCard,
  getStudentCards,
  getStudentCardById,
  updateStudentCard,
  deleteStudentCard,
  getStudentCardsByClientId
} = require('../controllers/studentController');
const { verifyToken } = require('../controllers/authController');
const upload = require('../utils/fileUploadUtil');

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Create new student card
router.post('/', upload.single('thumbnail'), createStudentCard);

// Get all student cards
router.get('/', getStudentCards);

// Get single student card
router.get('/:id', getStudentCardById);

// Update student card
router.put('/:id', upload.single('thumbnail'), updateStudentCard);

// Delete student card
router.delete('/:id', deleteStudentCard);
router.get('/client/:clientId', getStudentCardsByClientId);


module.exports = router;