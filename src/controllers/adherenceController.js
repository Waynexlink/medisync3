const AdherenceLog = require("../models/AdherenceLog");
const Medication = require("../models/Medication");
const Patient = require("../models/Patient"); // For potential validation

exports.logAdherence = async (req, res) => {
  try {
    const { medicationId, taken } = req.body;
    const patientId = req.body.patientId; // Assuming patientId is in the body

    // Basic validation
    if (!medicationId || typeof taken !== "boolean") {
      return res
        .status(400)
        .json({
          errors: [
            { msg: "Please provide medicationId and whether it was taken." },
          ],
        });
    }

    // Check if the medication exists and belongs to the patient (optional)
    const medication = await Medication.findOne({
      _id: medicationId,
      patient: patientId,
    });
    if (!medication) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Medication not found for this patient." }] });
    }

    const newAdherenceLog = new AdherenceLog({
      patient: patientId,
      medication: medicationId,
      taken,
    });

    const adherenceLog = await newAdherenceLog.save();

    res.status(201).json(adherenceLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAdherenceLogsForPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const logs = await AdherenceLog.find({ patient: patientId }).populate(
      "medication",
      "name"
    ); // Populate medication name
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
