// src/services/reportService.js
const Patient = require("../models/Patient");
const Medication = require("../models/Medication");
const AdherenceLog = require("../models/AdherenceLog");
const SideEffectLog = require("../models/SideEffectLog");

exports.generateWeeklyReport = async (patientId) => {
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return null; // Or throw an error
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start on Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - now.getDay() + 6); // End on Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    const medications = await Medication.find({ patient: patientId });
    const adherenceLogs = await AdherenceLog.find({
      patient: patientId,
      logDate: { $gte: startOfWeek, $lte: endOfWeek },
    }).populate("medication", "name");
    const sideEffectLogs = await SideEffectLog.find({
      patient: patientId,
      logDate: { $gte: startOfWeek, $lte: endOfWeek },
    });

    let report = `Weekly Health Summary for ${patient.firstName} <span class="math-inline">\{patient\.lastName\} \(</span>{patient.email})\n\n`;
    report += `Week of ${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}\n\n`;

    if (medications.length > 0) {
      report += "Medication Adherence:\n";
      for (const medication of medications) {
        const medicationLogs = adherenceLogs.filter(
          (log) => log.medication._id.toString() === medication._id.toString()
        );
        const takenCount = medicationLogs.filter((log) => log.taken).length;
        const totalLogs = medicationLogs.length;
        const adherenceRate =
          totalLogs > 0 ? ((takenCount / totalLogs) * 100).toFixed(2) : "N/A";
        report += `- <span class="math-inline">\{medication\.name\} \(</span>{medication.dosage || 'N/A'}): Adherence - ${adherenceRate}%\n`;
        // You could add more details about specific days if needed
      }
      report += "\n";
    } else {
      report += "No medications recorded.\n\n";
    }

    if (sideEffectLogs.length > 0) {
      report += "Side Effects Reported:\n";
      for (const log of sideEffectLogs) {
        report += `- <span class="math-inline">\{log\.description\} \(</span>{log.severity || 'Not specified'}) on ${log.logDate.toLocaleDateString()}\n`;
      }
    } else {
      report += "No side effects reported this week.\n";
    }

    return report;
  } catch (err) {
    console.error("Error generating weekly report:", err);
    return null;
  }
};

exports.sendWeeklyReportEmail = async (patientId) => {
  const patient = await Patient.findById(patientId);
  if (!patient || !patient.clinicianEmail) {
    console.log(`No clinician email configured for patient ${patientId}`);
    return;
  }

  const report = await this.generateWeeklyReport(patientId);
  if (!report) {
    console.error(`Failed to generate report for patient ${patientId}`);
    return;
  }

  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS || "medication-report@example.com", // Configure a sender email in .env if you like
    to: patient.clinicianEmail,
    subject: `Weekly Medication Summary for ${patient.firstName} ${patient.lastName}`,
    text: report,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`Email sent to ${patient.clinicianEmail}: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
