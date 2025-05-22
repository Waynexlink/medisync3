const express = require("express");
const router = express.Router();
const adherenceController = require("../controllers/adherenceController");

// @route   POST api/adherence
// @desc    Log medication adherence
// @access  Private (needs authentication)
router.post("/", adherenceController.logAdherence);

// @route   GET api/adherence/:patientId
// @desc    Get adherence logs for a specific patient
// @access  Private (needs authentication)
router.get("/:patientId", adherenceController.getAdherenceLogsForPatient);

module.exports = router;
