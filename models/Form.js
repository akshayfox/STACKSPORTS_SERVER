const mongoose = require("mongoose");

const FormElementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["text", "image"],
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: [
      {
        value: { type: String },
        label: { type: String },
      },
    ],
  },
  { _id: false } // Prevent Mongoose from generating an extra `_id` for each subdocument
);

const FormSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    elements: {
      type: [FormElementSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
