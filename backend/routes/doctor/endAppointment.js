const express = require('express');
const router = express.Router();
const db = require('../../db');
router.patch('/end/:appointmentID', async (req, res) => {
  const { appointmentID } = req.params;

  const sql = `
    UPDATE Appointments
    SET status = 'Ended'
    WHERE appointmentNumber = ?
  `;

  try {
    const [result] = await db.promise().query(sql, [appointmentID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment marked as completed' });
  } catch (err) {
    console.error('Error ending appointment:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;

