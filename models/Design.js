// models/template.js

const mongoose = require("mongoose");

const styleSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number, required: true },
  fontSize: { type: Number },
  shapeType: { type: String, required: true },
  color: { type: String },
  backgroundColor: { type: String },
});

const elementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "shape"], required: true },
  content: { type: String},
  style: { type: styleSchema, required: true },
});

const canvasSizeSchema = new mongoose.Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
});

const templateSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  thumbnail: { type: String},
  elements: { type: [elementSchema] },
  canvasSize: { type: canvasSizeSchema, required: true },
},{
  timestamps:true
});

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
