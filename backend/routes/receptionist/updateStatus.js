// Example: appointments/updateStatus.js
const express = require("express");
const router = express.Router();
const db = require("../../db");

router.patch("/update-status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE appointments SET status = ?, checkInTime = NOW() WHERE appointmentNumber = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err.message });
    return res.status(200).json({ message: "Status updated" });
  });
});

module.exports = router;

  