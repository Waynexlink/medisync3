require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const cron = require("node-cron");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const adherenceRoutes = require("./routes/adherenceRoutes");
const sideEffectsRoutes = require("./routes/sideEffectsRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Views engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Session middleware
const session = require("express-session");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// API Routes (keep these)
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/adherence", adherenceRoutes);
app.use("/api/side-effects", sideEffectsRoutes);
app.use("/api/reports", reportRoutes);

// Import auth controller for page routes
const authController = require("../src/controllers/authController");
const medicationController = require("../src/controllers/medicationController");
const sideEffectController = require("../src/controllers/sideEffectController");

// Page routes (frontend)
app.get("/login", authController.showLoginPage);
app.get("/register", authController.showRegisterPage);
app.get("/logout", authController.logout);

// Form processing routes (frontend)
app.post("/register", authController.registerPatient);
app.post("/login", authController.loginPatient);

app.get("/dashboard", authController.requireAuth, (req, res) => {
  res.render("pages/dashboard", {
    title: "Dashboard - MedSync",
    patientName: req.session.patientName || "User",
  });
});

// Medication pages
app.get(
  "/medications",
  authController.requireAuth,
  medicationController.showMedicationsPage
);
app.get(
  "/add-medication",
  authController.requireAuth,
  medicationController.showAddMedicationPage
);
app.post(
  "/add-medication",
  authController.requireAuth,
  medicationController.addMedicationEJS
);

// Side effect pages
app.get(
  "/side-effects",
  authController.requireAuth,
  sideEffectController.showSideEffectsPage
);
app.get(
  "/log-side-effect",
  authController.requireAuth,
  sideEffectController.showLogSideEffectPage
);
app.post(
  "/log-side-effect",
  authController.requireAuth,
  sideEffectController.logSideEffectEJS
);

// Root route - ONLY ONE
app.get("/", (req, res) => {
  if (req.session.patientId) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

// Cron schedule
cron.schedule("0 0 * * 0", async () => {
  console.log("Running weekly report generation and email task...");
  try {
    const Patient = require("./src/models/Patient");
    const reportService = require("./src/services/reportService");
    const allPatients = await Patient.find();
    for (const patient of allPatients) {
      await reportService.sendWeeklyReportEmail(patient._id);
    }
    console.log("Weekly reports sent.");
  } catch (error) {
    console.error("Error running weekly report task:", error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
