const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  time: {
    type: String,
    default: new Date().toLocaleTimeString(),
  },
  status: {
    type: String,
    enum: ["present", "absent", "late"],
    default: "present",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    role: ["admin", "teacher", "super-admin"],
    required: false,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
