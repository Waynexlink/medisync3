const Medication = require("../models/Medication");
const Patient = require("../models/Patient"); // We might need to verify the patient

exports.addMedication = async (req, res) => {
  try {
    const { name, dosage, schedule } = req.body;
    const patientId = req.body.patientId; // Assuming you're passing patientId in the request body for now

    // Basic validation
    if (
      !name ||
      !schedule ||
      !Array.isArray(schedule) ||
      schedule.length === 0
    ) {
      return res
        .status(400)
        .json({
          errors: [{ msg: "Please provide medication name and schedule." }],
        });
    }

    // Check if the patient exists (optional, depending on your auth flow)
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
    const patientId = req.params.patientId; // Assuming you're getting patientId from the route params

    const medications = await Medication.find({ patient: patientId });
    res.json(medications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
