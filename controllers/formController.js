// controllers/designController.js
const Form = require("../models/Form");

const createForm = async (req, res, next) => {
  try {
    const formData = req.body;
    if (!formData.templateId || !formData.name || !formData.elements) {
      return res.status(400).json({ message: "Invalid form data" });
    }
    const form = new Form(formData);
    await form.save();
    return res.status(201).json({ message: "Form saved successfully", form });
  } catch (error) {
    console.error("Error saving form:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};


const getForm = async (req, res, next) => {
  try {
    const { templateId } = req.query; // Extracting 'templateId' from query parameters
    if (templateId) {
      const forms = await Form.find({ templateId }); // Filter forms by templateId
      if (forms.length === 0) {
        return res.status(404).json({ message: "No forms found for the given templateId" });
      }
      return res
        .status(200)
        .json({ message: "Forms retrieved successfully", forms });
    }
    const forms = await Form.find();
    return res
      .status(200)
      .json({ message: "All forms retrieved successfully", forms });
  } catch (error) {
    console.error("Error retrieving form(s):", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { getForm };





  
module.exports = { createForm ,getForm};
