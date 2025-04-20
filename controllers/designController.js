// controllers/designController.js
const Design = require('../models/Design');



const createDesign = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    const { name, templateData } = req.body;
    const parsedTemplate = JSON.parse(templateData);
    parsedTemplate.thumbnail = req.file.path.replace(/\\/g, "/");
    const newTemplate = new Design(parsedTemplate);
    await newTemplate.save();
    return res.status(201).json({
      message: "Design created successfully",
      design: newTemplate,
    });
  } catch (error) {
    console.error("Error creating design:", error);
    return res.status(500).json({ error: "Error creating design: " + error.message });
  }
};








const deleteDesign = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }
    const fs = require('fs');
    if (design.thumbnail) {
      fs.unlink(design.thumbnail, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("Thumbnail file deleted:", design.thumbnail);
        }
      });
    }
    await Design.findByIdAndDelete(id);
    return res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting design:", error);
    return res.status(500).json({ error: "Error deleting design: " + error.message });
  }
};










const editDesign = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { name, templateData } = req.body;
    const existingDesign = await Design.findById(id);

    if (!existingDesign) {
      return res.status(404).json({ error: "Design not found" });
    }
    if (req.file) {
      existingDesign.thumbnail = req.file.path.replace(/\\/g, "/");
    }
    if (name) {
      existingDesign.name = name;
    }
    if (templateData) {
      try {
        const parsedTemplate = JSON.parse(templateData);
        if (parsedTemplate.elements) {
          existingDesign.elements = parsedTemplate.elements;
        }
        if (parsedTemplate.canvasSize) {
          existingDesign.canvasSize = parsedTemplate.canvasSize;
        }
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid JSON in templateData" });
      }
    }
    await existingDesign.save();
    return res.status(200).json({
      message: "Design updated successfully",
      design: existingDesign,
    });
  } catch (error) {
    console.error("Error updating design:", error);
    return res.status(500).json({ error: "Error updating design: " + error.message });
  }
};



const copyDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    if (!newName) {
      return res.status(400).json({ error: "New design name is required" });
    }
    const originalDesign = await Design.findById(id);
    if (!originalDesign) {
      return res.status(404).json({ error: "Original design not found" });
    }
    const designCopy = new Design({
      id: Date.now().toString(), // Generate a new unique ID
      name: newName,
      thumbnail: originalDesign.thumbnail,
      elements: originalDesign.elements,
      canvasSize: originalDesign.canvasSize
    });
    await designCopy.save();
    return res.status(201).json({
      message: "Design copied successfully",
      design: designCopy
    });
  } catch (error) {
    console.error("Error copying design:", error);
    return res.status(500).json({ error: "Error copying design: " + error.message });
  }
};







  const getDesigns = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (id) {
        // Fetch a single design by ID
        const design = await Design.findById(id);
        if (!design) {
          return res.status(404).json({ error: 'Design not found' });
        }
        return res.status(200).json({ design });
      } else {
        // Fetch all designs
        const designs = await Design.find();
        return res.status(200).json({ designs });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching designs: ' + error.message });
    }
  };
  
  
module.exports = { createDesign, getDesigns, deleteDesign, editDesign, copyDesign };
