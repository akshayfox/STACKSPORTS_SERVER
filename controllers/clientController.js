const Client = require('../models/Client');
const { verifyToken } = require('./authController');

// Create a new client
const createClient = async (req, res) => {
  try {
    const clientData = req.body;
    clientData.user = req.userId;
    const client = new Client(clientData);
    await client.save();
    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      client
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating client",
      error: error.message
    });
  }
};

// Get all clients or filter by user ID
const getClients = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      query.user = userId;
    }
    const clients = await Client.find(query)
      .populate('template', 'name thumbnail')
      .populate('user', 'username');
    return res.status(200).json({
      success: true,
      count: clients.length,
      data:clients
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching clients",
      error: error.message
    });
  }
};

// Get a single client by ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await Client.findById(id)
      .populate('template', 'name thumbnail')
      .populate('user', 'username');
      
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      client
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching client",
      error: error.message
    });
  }
};

// Update a client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find the client first to check if it exists
    const client = await Client.findById(id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    // Optional: Check if the user is authorized to update this client
    if (client.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this client"
      });
    }
    
    // Update the client
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('template', 'name thumbnail')
     .populate('user', 'username');
    
    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client: updatedClient
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating client",
      error: error.message
    });
  }
};

// Delete a client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the client first to check if it exists
    const client = await Client.findById(id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    // Optional: Check if the user is authorized to delete this client
    if (client.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this client"
      });
    }
    
    await Client.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: "Client deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting client",
      error: error.message
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};