const SideEffectLog = require("../models/SideEffectLog");
const Patient = require("../models/Patient");

// Show log side effect page
exports.showLogSideEffectPage = (req, res) => {
  res.render("pages/log-side-effect", {
    title: "Log Side Effect - MedSync",
    error: null,
    success: null,
  });
};

// Show side effects history page
exports.showSideEffectsPage = async (req, res) => {
  try {
    const patientId = req.session.patientId;
    const sideEffects = await SideEffectLog.find({ patient: patientId }).sort({
      date: -1,
    });

    res.render("pages/side-effects", {
      title: "Side Effects History - MedSync",
      sideEffects: sideEffects,
      error: null,
    });
  } catch (err) {
    console.error(err.message);
    res.render("pages/side-effects", {
      title: "Side Effects History - MedSync",
      sideEffects: [],
      error: "Error loading side effects",
    });
  }
};

// Process log side effect form (EJS version)
exports.logSideEffectEJS = async (req, res) => {
  try {
    const { description, severity } = req.body;
    const patientId = req.session.patientId;

    if (!description) {
      return res.render("pages/log-side-effect", {
        title: "Log Side Effect - MedSync",
        error: "Please provide a description of the side effect.",
        success: null,
      });
    }

    if (severity && !["Mild", "Moderate", "Severe"].includes(severity)) {
      return res.render("pages/log-side-effect", {
        title: "Log Side Effect - MedSync",
        error: "Severity must be one of: Mild, Moderate, Severe.",
        success: null,
      });
    }

    const newSideEffectLog = new SideEffectLog({
      patient: patientId,
      description,
      severity,
    });

    await newSideEffectLog.save();

    res.render("pages/log-side-effect", {
      title: "Log Side Effect - MedSync",
      error: null,
      success: "Side effect logged successfully!",
    });
  } catch (err) {
    console.error(err.message);
    res.render("pages/log-side-effect", {
      title: "Log Side Effect - MedSync",
      error: "Server error occurred",
      success: null,
    });
  }
};

// Keep your existing API methods
exports.logSideEffect = async (req, res) => {
  try {
    const { description, severity } = req.body;
    const patientId = req.body.patientId;

    if (!description) {
      return res.status(400).json({
        errors: [{ msg: "Please provide a description of the side effect." }],
      });
    }
    if (severity && !["Mild", "Moderate", "Severe"].includes(severity)) {
      return res.status(400).json({
        errors: [{ msg: "Severity must be one of: Mild, Moderate, Severe." }],
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ errors: [{ msg: "Patient not found." }] });
    }

    const newSideEffectLog = new SideEffectLog({
      patient: patientId,
      description,
      severity,
    });

    const sideEffectLog = await newSideEffectLog.save();
    res.status(201).json(sideEffectLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSideEffectsForPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const logs = await SideEffectLog.find({ patient: patientId });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
