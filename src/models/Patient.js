const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures each patient has a unique email
  },
  password: {
    type: String,
    required: true,
  },
  clinicianEmail: {
    type: String,
    trim: true, // Removes whitespace from both ends
    lowercase: true, // Ensures email is stored in lowercase
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  // You might add more fields later, like contact info, etc.
});

module.exports = mongoose.model("Patient", PatientSchema);
