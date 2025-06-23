const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");

// Render login page
exports.showLoginPage = (req, res) => {
  res.render("pages/login", {
    title: "Login - MedSync",
    error: null,
  });
};

// Render registration page
exports.showRegisterPage = (req, res) => {
  res.render("pages/register", {
    title: "Register - MedSync",
    error: null,
  });
};

// Process registration form
exports.registerPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the patient already exists
    let patient = await Patient.findOne({ email });
    if (patient) {
      return res.render("pages/register", {
        title: "Register - MedSync",
        error: "Patient already exists",
      });
    }

    // Create a new patient instance
    patient = new Patient({
      firstName,
      lastName,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(password, salt);

    // Save the patient to the database
    await patient.save();

    // Redirect to login with success message
    res.render("pages/login", {
      title: "Login - MedSync",
      success: "Registration successful! Please login.",
      error: null,
    });
  } catch (err) {
    console.error(err.message);
    res.render("pages/register", {
      title: "Register - MedSync",
      error: "Server error occurred",
    });
  }
};

// Process login form
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the patient exists
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.render("pages/login", {
        title: "Login - MedSync",
        error: "Invalid credentials",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.render("pages/login", {
        title: "Login - MedSync",
        error: "Invalid credentials",
      });
    }

    // Store patient info in session
    req.session.patientId = patient._id;
    req.session.patientName = `${patient.firstName} ${patient.lastName}`;

    // Redirect to dashboard
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err.message);
    res.render("pages/login", {
      title: "Login - MedSync",
      error: "Server error occurred",
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
};

// Middleware to check if user is logged in
exports.requireAuth = (req, res, next) => {
  if (req.session.patientId) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Keep this for AJAX calls (updating clinician email)
exports.updateClinicianEmail = async (req, res) => {
  try {
    const { clinicianEmail } = req.body;
    const patientId = req.session.patientId; // Get from session instead

    if (clinicianEmail && !/\S+@\S+\.\S+/.test(clinicianEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinician email format.",
      });
    }

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      {
        clinicianEmail: clinicianEmail
          ? clinicianEmail.toLowerCase().trim()
          : null,
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    res.json({
      success: true,
      message: "Clinician email updated successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
