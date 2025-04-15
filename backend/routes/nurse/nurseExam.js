const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/:id", async (req, res) => {
  try {
    const patientId = req.params.id;

    const [result] = await db.promise().query(
      `
      SELECT p.*, pf.* 
      FROM patient p
      JOIN patientform pf ON p.patientID = pf.patientID

      WHERE p.patientID = ?
      `,
      [patientId]
    );

    if (result.length === 0) {
      return res.status(404).send("Patient not found");
    }

    const raw = result[0];
    const patientData = {
      patientID: raw.patientID,
      name: raw.name,
      dob: raw.dob,
      sex: raw.sex,
      contactInfo: raw.contactInfo,
      medicalForm: {
        formID: raw.formID,
        prescriptions: raw.prescriptions,
        healthConcerns: raw.healthConcerns,
        conditions: raw.conditions,
        surgeries: raw.surgeries,
        allergies: raw.allergies,
        additionalNotes: raw.additionalNotes
      }
    };

    res.json(patientData);
  } catch (err) {
    console.error("Error fetching patient data for nurse:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
