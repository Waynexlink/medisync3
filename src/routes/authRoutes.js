const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Only keep API routes here (for your React frontend if you add it later)
router.put(
  "/clinician-email",
  authController.requireAuth,
  authController.updateClinicianEmail
);

module.exports = router;
