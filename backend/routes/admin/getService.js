const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/services", (req, res) => {
  const sql = "SELECT * FROM services";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching services:", err);
      return res.status(500).json({ error: "Failed to fetch services" });
    }
    res.json(results);
  });
});

module.exports = router;
