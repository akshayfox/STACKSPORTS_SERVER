const express = require("express");
const upload = require('../utils/fileUploadUtil');
const path = require('path');
const fs = require('fs');
const Image = require("../models/UploadImages");



const router = express.Router();


router.post('/upload', upload.array('images', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    try {
      const fileDocs = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        type: file.mimetype,
      }));
      const savedFiles = await Image.insertMany(fileDocs);
      res.status(200).json({
        message: 'Files uploaded and saved successfully.',
        docs: savedFiles,
      });
    } catch (error) {
      console.error('Error saving files to the database:', error);
      res.status(500).json({ error: 'Internal server error while saving files.' });
    }
  });



  
  router.get('/files', async (req, res) => {
    try {
      const images = await Image.find();
      const imagePaths = images.map((image) => ({
        name: image.name,
        url:image.url,
        _id: image._id,

      }));
      res.json({ files: imagePaths });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to fetch images." });
    }
  });



  // Add this route to your existing router

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    const filePath = path.join(__dirname, '..', 'public', image.url);
    if (fs.existsSync(filePath)) {
      // Delete the file from the filesystem
      fs.unlinkSync(filePath);
    }
    await Image.findByIdAndDelete(id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});



router.delete('/delete-multiple', async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty image IDs array' });
  }
  try {
    const images = await Image.find({ _id: { $in: ids } });
    for (const image of images) {
      const filePath = path.join(__dirname, '..', 'public', image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    const result = await Image.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      message: `${result.deletedCount} images deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    res.status(500).json({ error: 'Failed to delete images' });
  }
});


module.exports = router;
