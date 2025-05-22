// src/controllers/reportController.js
const reportService = require("../services/reportService");

exports.getWeeklyReport = async (req, res) => {
  const patientId = req.params.patientId; // For testing, get patient ID from params
  const report = await reportService.generateWeeklyReport(patientId);
  if (report) {
    res.send(report);
  } else {
    res.status(404).send("Report generation failed or patient not found.");
  }
};
