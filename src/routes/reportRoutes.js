// src/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// @route   GET api/reports/weekly/:patientId
// @desc    Generate and view a weekly report for a patient (for testing)
// @access  Private (needs auth)
router.get("/weekly/:patientId", reportController.getWeeklyReport);

module.exports = router;
