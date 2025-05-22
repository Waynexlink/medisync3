const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// @route   POST api/auth/register
// @desc    Register a new patient
// @access  Public
router.post("/register", authController.registerPatient);

// @route   POST api/auth/login
// @desc    Authenticate patient & get token (we're just sending success for now)
// @access  Public
router.post("/login", authController.loginPatient);
// @route   PUT api/auth/clinician-email
// @desc    Update the patient's clinician email
// @access  Private (needs authentication)
router.put("/clinician-email", authController.updateClinicianEmail);

// @route   GET api/auth/profile/:patientId
// @desc    Get patient profile information
// @access  Private (needs authentication)
router.get("/profile/:patientId", authController.getPatientProfile);

module.exports = router;
