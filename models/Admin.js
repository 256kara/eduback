const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  role: {
    type: String,
    default: "admin",
    required: true,
  },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
});

module.exports = mongoose.model("Admin", adminSchema);
