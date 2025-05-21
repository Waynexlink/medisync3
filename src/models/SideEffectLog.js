const mongoose = require("mongoose");

const SideEffectLogSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String, // e.g., "Mild", "Moderate", "Severe"
    enum: ["Mild", "Moderate", "Severe"], // Optional: restrict to these values
  },
  logDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SideEffectLog", SideEffectLogSchema);
