const StudentCard = require('../models/Student');
const { AppError } = require('../utils/errorHandler');

// Create new student card
const createStudentCard = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new AppError('Missing data field in request', 400);
    }
    
    let studentCardData;
    try {
      studentCardData = JSON.parse(req.body.data);
    } catch (error) {
      throw new AppError('Invalid JSON data', 400);
    }

    if (!studentCardData.client) {
      throw new AppError('Missing required fields (client)', 400);
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
    next(error);
  }
};

// Get all student cards
const getStudentCards = async (req, res, next) => {
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
    next(error);
  }
};

// Get student cards by client ID
const getStudentCardsByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { groupId } = req.query;
    if (!clientId) {
      throw new AppError('Client ID is required', 400);
    }
    const filter = { client: clientId };
    if (groupId) {
      filter.group = groupId;
    }
    const cards = await StudentCard.find(filter)
      .populate('client', 'fullname')
      .populate('group', 'username')
      .populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards
    });
  } catch (error) {
    next(error);
  }
};


// Get single student card
const getStudentCardById = async (req, res, next) => {
  try {
    const card = await StudentCard.findOne({ id: req.params.id })
      .populate('client', 'fullname')
      .populate('group', 'username')
      .populate('createdBy', 'username');

    if (!card) {
      throw new AppError('Student card not found', 404);
    }

    res.status(200).json({
      success: true,
      card
    });
  } catch (error) {
    next(error);
  }
};

// Update student card
const updateStudentCard = async (req, res, next) => {
  try {
    const updates = req.body;
    const card = await StudentCard.findOne({ id: req.params.id });

    if (!card) {
      throw new AppError('Student card not found', 404);
    }

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdBy') {
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
    next(error);
  }
};

// Delete student card
const deleteStudentCard = async (req, res, next) => {
  try {
    const card = await StudentCard.findOne({ id: req.params.id });

    if (!card) {
      throw new AppError('Student card not found', 404);
    }

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
    next(error);
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