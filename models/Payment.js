const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    enum: ["basic", "moderate", "unlimited"],
    default: "basic",
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
