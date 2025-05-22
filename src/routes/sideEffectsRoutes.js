const express = require("express");
const router = express.Router();
const sideEffectController = require("../controllers/sideEffectController");

// @route   POST api/side-effects
// @desc    Log a new side effect
// @access  Private (needs authentication)
router.post("/", sideEffectController.logSideEffect);

// @route   GET api/side-effects/:patientId
// @desc    Get side effects for a specific patient
// @access  Private (needs authentication)
router.get("/:patientId", sideEffectController.getSideEffectsForPatient);

module.exports = router;
