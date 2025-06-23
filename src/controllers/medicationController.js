const Medication = require("../models/Medication");
const Patient = require("../models/Patient");

// Show add medication page
exports.showAddMedicationPage = (req, res) => {
  res.render("pages/add-medication", {
    title: "Add Medication - MedSync",
    error: null,
    success: null,
  });
};

// Show medications list page
exports.showMedicationsPage = async (req, res) => {
  try {
    const patientId = req.session.patientId;
    const medications = await Medication.find({ patient: patientId });

    res.render("pages/medications", {
      title: "My Medications - MedSync",
      medications: medications,
      error: null,
    });
  } catch (err) {
    console.error(err.message);
    res.render("pages/medications", {
      title: "My Medications - MedSync",
      medications: [],
      error: "Error loading medications",
    });
  }
};

// Process add medication form (EJS version)
exports.addMedicationEJS = async (req, res) => {
  try {
    const { name, dosage, schedule } = req.body;
    const patientId = req.session.patientId; // Get from session

    // Basic validation
    if (!name || !schedule) {
      return res.render("pages/add-medication", {
        title: "Add Medication - MedSync",
        error: "Please provide medication name and schedule.",
        success: null,
      });
    }

    // Convert schedule string to array if needed
    let scheduleArray = schedule;
    if (typeof schedule === "string") {
      scheduleArray = schedule.split(",").map((s) => s.trim());
    }

    const newMedication = new Medication({
      patient: patientId,
      name,
      dosage,
      schedule: scheduleArray,
    });

    await newMedication.save();

    res.render("pages/add-medication", {
      title: "Add Medication - MedSync",
      error: null,
      success: "Medication added successfully!",
    });
  } catch (err) {
    console.error(err.message);
    res.render("pages/add-medication", {
      title: "Add Medication - MedSync",
      error: "Server error occurred",
      success: null,
    });
  }
};

// Keep your existing API methods
exports.addMedication = async (req, res) => {
  try {
    const { name, dosage, schedule } = req.body;
    const patientId = req.body.patientId;

    if (
      !name ||
      !schedule ||
      !Array.isArray(schedule) ||
      schedule.length === 0
    ) {
      return res.status(400).json({
        errors: [{ msg: "Please provide medication name and schedule." }],
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ errors: [{ msg: "Patient not found." }] });
    }

    const newMedication = new Medication({
      patient: patientId,
      name,
      dosage,
      schedule,
    });

    const medication = await newMedication.save();
    res.status(201).json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPatientMedications = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const medications = await Medication.find({ patient: patientId });
    res.json(medications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
