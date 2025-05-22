const SideEffectLog = require("../models/SideEffectLog");
const Patient = require("../models/Patient"); // For potential validation

exports.logSideEffect = async (req, res) => {
  try {
    const { description, severity } = req.body;
    const patientId = req.body.patientId; // Assuming patientId is in the body

    // Basic validation
    if (!description) {
      return res
        .status(400)
        .json({
          errors: [{ msg: "Please provide a description of the side effect." }],
        });
    }
    if (severity && !["Mild", "Moderate", "Severe"].includes(severity)) {
      return res
        .status(400)
        .json({
          errors: [{ msg: "Severity must be one of: Mild, Moderate, Severe." }],
        });
    }

    // Check if the patient exists (optional)
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
