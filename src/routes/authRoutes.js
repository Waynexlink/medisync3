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

module.exports = router;
