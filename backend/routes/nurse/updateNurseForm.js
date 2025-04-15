const express = require("express");
const router = express.Router();
const db = require("../../db");

router.patch("/update-form/:id", async (req, res) => {
  const formID = req.params.id;
  const data = req.body;

  const updateSQL = `
    UPDATE patientform SET
      usesCorrectiveLenses = ?,
      usesContacts = ?,
      LensesPrescription = ?,
      ContactsPrescription = ?,
      lastPrescriptionDate = ?,
      healthConcerns = ?,
      otherConcerns = ?,
      conditions = ?,
      otherConditions = ?,
      hadSurgery = ?,
      surgeries = ?,
      otherSurgeries = ?,
      allergies = ?,
      additionalDetails = ?
    WHERE medicalFormID = ?
  `;

  const values = [
    data.usesCorrectiveLenses,
    data.usesContacts,
    data.LensesPrescription,
    data.ContactsPrescription,
    data.lastPrescriptionDate,
    data.healthConcerns,
    data.otherConcerns,
    data.conditions,
    data.otherConditions,
    data.hadSurgery,
    data.surgeries,
    data.otherSurgeries,
    data.allergies,
    data.additionalDetails,
    formID
  ];

  try {
    const [result] = await db.promise().query(updateSQL, values);
    res.status(200).json({ message: "Form updated successfully", affectedRows: result.affectedRows });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update medical form" });
  }
});

module.exports = router;
