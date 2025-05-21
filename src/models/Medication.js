const mongoose = require("mongoose");

const MedicationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
  },
  schedule: {
    type: [String], // Array of times or descriptions (e.g., ["8:00 AM", "Before bed"])
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  // You might add fields like 'notes', 'route', etc.
});

module.exports = mongoose.model("Medication", MedicationSchema);
