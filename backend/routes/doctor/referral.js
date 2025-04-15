const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/', async (req, res) => {
  const {
    appointmentID,
    patientID,
    specialty,
    reason,
    urgency,
    referredTo,
    additionalNotes,
    doctorID 
  } = req.body;

  const sql = `
  INSERT INTO Referrals (
    appointmentNumber, patientID, referralDate,
    specialistType, referralReason, urgencyLevel,
    referredToClinic, notes, doctorID
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const referralDate = new Date().toISOString().slice(0, 10);

  const values = [
    appointmentID,
    patientID,
    referralDate,
    specialty,
    reason,
    urgency || 'Routine',
    referredTo,
    additionalNotes,
    doctorID 
  ];

  try {
    await db.promise().query(sql, values);
    res.status(201).json({ success: true, message: 'Referral submitted successfully' });
  } catch (err) {
    console.error('Referral DB error:', err);
    res.status(500).json({ success: false, message: 'Database error submitting referral' });
  }
});

module.exports = router;
