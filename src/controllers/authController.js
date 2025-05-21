const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");

exports.registerPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the patient already exists
    let patient = await Patient.findOne({ email });
    if (patient) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Patient already exists" }] });
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

    // For now, let's just send a success message.
    // In a real application, you might generate a JWT here for authentication.
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the patient exists
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // For now, let's just send a success message with the patient's ID.
    // In a real application, you would generate and send a JWT here.
    res.json({ message: "Login successful", patientId: patient._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
