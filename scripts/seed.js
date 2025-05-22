// scripts/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Patient = require("../src/models/Patient");
const Medication = require("../src/models/Medication");
const AdherenceLog = require("../src/models/AdherenceLog");
const SideEffectLog = require("../src/models/SideEffectLog");

const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/medication_management";

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data (for easy re-runs)
    await Patient.deleteMany({});
    await Medication.deleteMany({});
    await AdherenceLog.deleteMany({});
    await SideEffectLog.deleteMany({});
    console.log("Cleared existing data.");

    // Create a test patient
    const hashedPassword = await bcrypt.hash("password123", 10);
    const patient = new Patient({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: hashedPassword,
      clinicianEmail: "clinician@example.com",
    });
    await patient.save();
    const patientId = patient._id;
    console.log("Test patient created:", patientId);

    // Add a medication for the patient
    const medication = new Medication({
      patient: patientId,
      name: "Paracetamol",
      dosage: "500mg",
      schedule: ["8:00 AM", "8:00 PM"],
    });
    await medication.save();
    const medicationId = medication._id;
    console.log("Test medication added:", medicationId);

    // Log some adherence
    await AdherenceLog.create({
      patient: patientId,
      medication: medicationId,
      taken: true,
    });
    await AdherenceLog.create({
      patient: patientId,
      medication: medicationId,
      taken: false,
    });
    console.log("Adherence logs added.");

    // Log a side effect
    await SideEffectLog.create({
      patient: patientId,
      description: "Slight drowsiness",
      severity: "Mild",
    });
    console.log("Side effect log added.");

    console.log("Database seeding complete.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.disconnect();
  }
}

seedDatabase();
