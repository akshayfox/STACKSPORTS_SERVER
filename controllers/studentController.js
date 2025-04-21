const StudentCard = require('../models/Student');

// Create new student card
const createStudentCard = async (req, res) => {
  try {
    if (!req.body.data) {
      return res.status(400).json({
        success: false,
        message: 'Missing data field in request'
      });
    }
    let studentCardData;
    try {
      studentCardData = JSON.parse(req.body.data);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON data'
      });
    }
    if (!studentCardData.client) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (client)'
      });
    }
    Object.assign(studentCardData, {
      name: studentCardData.name || 'Untitled Card',
      canvasSize: studentCardData.canvasSize || { width: 800, height: 600 },
      elements: studentCardData.elements || [],
      createdBy: req.userId,
      ...(req.file && { thumbnail: req.file.path })
    });
    const studentCard = await new StudentCard(studentCardData).save();
    return res.status(201).json({
      success: true,
      message: 'Student card created successfully',
      card: studentCard
    });
  } catch (error) {
    console.error('Error creating student card:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all student cards with optional filters
const getStudentCards = async (req, res) => {
  try {
    const { client, group } = req.query;
    let query = {};

    if (client) query.client = client;
    if (group) query.group = group;

    const cards = await StudentCard.find(query)
      .populate('client', 'fullname')
      .populate('group', 'username')
      .populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      count: cards.length,
      cards
    });
  } catch (error) {
    console.error('Error fetching student cards:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get student cards by client ID
const getStudentCardsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      return res.status(400).json({ success: false, message: 'Client ID is required' });
    }
    const cards = await StudentCard.find({ client: clientId })
      .populate('client', 'fullname')
      .populate('group', 'username')
      .populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      count: cards.length,
      data:cards
    });
  } catch (error) {
    console.error('Error fetching cards by client ID:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get single student card by ID
const getStudentCardById = async (req, res) => {
  try {
    const card = await StudentCard.findOne({ id: req.params.id })
      .populate('client', 'fullname')
      .populate('group', 'username')
      .populate('createdBy', 'username');

    if (!card) {
      return res.status(404).json({ success: false, message: 'Student card not found' });
    }

    res.status(200).json({
      success: true,
      card
    });
  } catch (error) {
    console.error('Error fetching student card:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update student card
const updateStudentCard = async (req, res) => {
  try {
    const updates = req.body;
    const card = await StudentCard.findOne({ id: req.params.id });

    if (!card) {
      return res.status(404).json({ success: false, message: 'Student card not found' });
    }

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdBy') { // Prevent updating these fields
        card[key] = updates[key];
      }
    });

    await card.save();
    await card.populate([
      { path: 'client', select: 'fullname' },
      { path: 'group', select: 'username' },
      { path: 'createdBy', select: 'username' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Student card updated successfully',
      card
    });
  } catch (error) {
    console.error('Error updating student card:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete student card
const deleteStudentCard = async (req, res) => {
  try {
    const card = await StudentCard.findOne({ id: req.params.id });

    if (!card) {
      return res.status(404).json({ success: false, message: 'Student card not found' });
    }

    // Delete thumbnail if exists
    if (card.thumbnail) {
      const fs = require('fs');
      const path = require('path');
      const thumbnailPath = path.join(__dirname, '..', card.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await card.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student card:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStudentCard,
  getStudentCards,
  getStudentCardById,
  updateStudentCard,
  deleteStudentCard,
  getStudentCardsByClientId
};