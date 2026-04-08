const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  role: {
    type: String,
    default: "teacher",
    required: true,
  },
  email: { type: String, required: true },
  phone: { type: String },
  gender: { type: String },
  // subject list type
  subjects: [{ type: String }],
  qualification: { type: String },
  experience: { type: String },
  address: { type: String },
  status: { type: String },
  role: { type: String, enum: ["teacher", "admin"], default: "teacher" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
});

module.exports = mongoose.model("Teacher", teacherSchema);
