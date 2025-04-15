const express = require('express');
const { 
  createClient, 
  getClients, 
  getClientById, 
  updateClient, 
  deleteClient 
} = require('../controllers/clientController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

// Apply authentication middleware to all client routes
router.use(verifyToken);

// Create a new client
router.post('/', createClient);

// Get all clients with optional filtering
router.get('/', getClients);

// Get a single client by ID
router.get('/:id', getClientById);

// Update a client
router.put('/:id', updateClient);

// Delete a client
router.delete('/:id', deleteClient);

module.exports = router;