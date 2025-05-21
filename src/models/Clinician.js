const mongoose = require("mongoose");

const ClinicianSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // You might add other details later if needed
});

module.exports = mongoose.model("Clinician", ClinicianSchema);
