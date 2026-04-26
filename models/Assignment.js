const mongoose = require("mongoose");
const Subject = require("./Subject");
const School = require("./School");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  classLevel: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  instructions: {
    type: String,
  },
  time: {
    type: String,
    default: function () {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
