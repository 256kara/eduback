const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true }, // cleared
  phone: { type: String, default: "N/A" }, // cleared
  classLevel: {
    type: String,
    enum: ["S1", "S2", "S3", "S4", "S5", "S6"],
  }, // cleared
  createdAt: { type: Date, default: Date.now }, // cleared
  gender: { type: String, enum: ["male", "female"], default: "male" }, // cleared
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" }, // cleared
  admissionNumber: { type: String, required: true, unique: true }, // cleared
  stream: {
    type: String,
    required: true,
    enum: ["SCI", "ARTS", "N", "E", "S", "W", "NE", "NW", "SE", "SW", "N/A"],
    default: "N/A",
  }, // cleared
  email: { type: String, required: true }, // cleared
  combination: {
    type: String,
    enum: [
      "PCM",
      "PCB",
      "BCM",
      "BCFN",
      "N/A",
      "MEE",
      "MEA",
      "HELL",
      "MAT",
      "N/A",
    ],
    default: "N/A",
  }, // cleared
  nin: { type: String }, //cleared
  address: { type: String, default: "N/A" }, // cleared
  feesBalance: { type: Number, default: 0 }, // cleared
  healthStatus: {
    type: String,
    default: "N/A",
    enum: ["N/A", "Healthy", "Sick"],
  }, // cleared
  emergencyContact: { type: String, default: "N/A" }, // cleared
  attendance: { type: Number, default: 0 }, // cleared
  password: { type: String, required: true }, // cleared
  lin: { type: String, default: "Kmss" }, // cleared
  username: { type: String, required: true, unique: true }, // cleared
});

module.exports = mongoose.model("Student", studentSchema);
