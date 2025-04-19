const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/doctors", async (req, res) => {
  try {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT d.*, e.firstName, e.lastName, e.email FROM Doctors d
        JOIN Employee e ON d.employeeID = e.employeeID`
      );
      res.status(200).json(rows);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors from database." });
  }
});

router.get("/doctors/:id", async (req, res) => {
  const doctorID = req.params.id;

  try {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT d.*, e.firstName, e.lastName, e.email FROM Doctors d 
        JOIN Employee e ON d.employeeID = e.employeeID WHERE d.doctorID = ?`,
        [doctorID]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      res.json(rows[0]);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
