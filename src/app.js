require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const adherenceRoutes = require("./routes/adherenceRoutes");
const sideEffectsRoutes = require("./routes/sideEffectsRoutes");

const app = express();

//connect to database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/adherence", adherenceRoutes);
app.use("/api/side-effects", sideEffectsRoutes);

// A simple root route for testing
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the Medication Management API!" });
});

// Define a port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for potential testing later
