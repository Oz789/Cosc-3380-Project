const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/createContact', (req, res) => {
  const {
    name,
    price,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    waterContent,
    img
  } = req.body;

  const query = ` INSERT INTO eyeContacts (name, price, brand, model, visionType, useType, daysSupply, waterContent, img)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `;

  db.query(query, [
    name,
    price,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    waterContent,
    img
  ], (err, result) => {
    if (err) {
      console.error("Error inserting contact lens:", err);
      return res.status(500).json({ error: "Failed to create contact lens" });
    }
    res.status(201).json({ message: "Contact lens created successfully" });
  });
});

module.exports = router;
