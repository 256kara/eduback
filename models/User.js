const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "student", "super-admin", "teacher"],
    required: true,
  },
  phone: {
    type: String,
    required: function () {
      return this.role !== "student";
    },
  },
  password: {
    type: String,
    required: true,
  },
  gender: { type: String, enum: ["male", "female"] },
  isActive: { type: Boolean, enum: [true, false], default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
