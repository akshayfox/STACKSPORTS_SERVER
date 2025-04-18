const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Client",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subGroupTitle: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);