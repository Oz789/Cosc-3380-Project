const express = require("express");
const router = express.Router();
const db = require("../../db");

router.post("/createService", (req, res) => {
  const { serviceName, price, description, img } = req.body;

  const sql = ` INSERT INTO services (serviceName, price, description, img)
    VALUES (?, ?, ?, ?)`;

  db.query(sql, [serviceName, price, description, img], (err, result) => {
    if (err) {
    console.error("Error inserting service:", err);
            return res.status(500).json({ error: "Failed to create service" });
    }
    res.status(201).json({ message: "Service created successfully" });
  });
});

module.exports = router;
