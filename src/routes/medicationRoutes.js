const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");

// @route   POST api/medications
// @desc    Add a new medication for a patient
// @access  Private (needs authentication in a real app)
router.post("/", medicationController.addMedication);

// @route   GET api/medications/:patientId
// @desc    Get all medications for a specific patient
// @access  Private (needs authentication)
router.get("/:patientId", medicationController.getPatientMedications);

module.exports = router;
