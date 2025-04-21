const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "shape"], required: true },
  content: { type: String },
  style: { type: mongoose.Schema.Types.Mixed, required: true },
  dynamic: { type: Boolean, default: false },
  fieldName: { type: String },
  metadata: {
    isEditable: { type: Boolean, default: true },
    isRequired: { type: Boolean, default: false },
    defaultValue: { type: String }
  }
});;
const studentCardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, 
    name: { type: String, default: "Untitled card" },
    thumbnail: { type: String },
    canvasSize: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    elements: [elementSchema],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // group user
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin user
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("StudentCard", studentCardSchema);

