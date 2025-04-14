const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // File name (e.g., "image1.jpg")
    },
    url: {
      type: String,
      required: true, // URL or path to access the image
    },
    type: {
      type: String,
      required: true, // MIME type (e.g., "image/jpeg")
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
