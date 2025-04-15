const express = require('express');
const router = express.Router();
const db = require('../../db');

router.patch('/checkin/:id', async (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE appointments
    SET checkInTime = NOW(), status = 'Checked In'
    WHERE appointmentNumber = ?
  `;

  try {
    await db.promise().query(sql, [id]);
    res.status(200).json({ message: "Patient checked in" });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ error: "Check-in failed" });
  }
});

module.exports = router;
