const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: { type: String, default: "Kampala" },
  plan: {
    type: String,
    enum: ["basic", "moderate", "unlimited"],
    default: "basic",
  },
  studentsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, enum: [true, false], default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("School", schoolSchema);
