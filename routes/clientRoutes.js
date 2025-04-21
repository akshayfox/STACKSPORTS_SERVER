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
router.use(verifyToken);
router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;