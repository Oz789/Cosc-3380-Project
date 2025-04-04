const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/createFrame', (req, res) => {
  const {name,price,brand, color, model, material, lensWidth,lensHeight, bridgeWidth,
    templeLength,img
  } = req.body;

  const query = `INSERT INTO frames (name, price, brand, color, model, 
    material, lensWidth, lensHeight, bridgeWidth, templeLength, img)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    name,price, brand,color,model,material,lensWidth, lensHeight,bridgeWidth,
    templeLength,
    img
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting frame:', err);
      return res.status(500).json({ error: 'Failed to create frame' });
    }

    res.status(201).json({ message: 'Frame created successfully', frameID: result.insertId });
  });
});

module.exports = router;
