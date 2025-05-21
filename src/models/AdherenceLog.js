const mongoose = require("mongoose");

const AdherenceLogSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
  taken: {
    type: Boolean,
    required: true,
  },
  logDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AdherenceLog", AdherenceLogSchema);
