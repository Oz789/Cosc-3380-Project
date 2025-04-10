const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/inventory', async (req, res) => {
  try {
 
    const [frames] = await db.promise().query(`
      SELECT 
        i.itemID,
        i.stockCount,
        f.name AS name,
        f.model AS model,
        f.brand AS brand,
        f.material AS material,
        f.price AS price
      FROM inventory i
      JOIN frames f ON i.frameID = f.frameID
    `);

    const formattedFrames = frames.map(item => ({
      itemID: item.itemID,
      type: 'Frame',
      name: item.name,
      model: item.model,
      brand: item.brand,
      material: item.material,
      price: parseFloat(item.price),
      stockCount: item.stockCount
    }));

    // Contacts
    const [contacts] = await db.promise().query(`
      SELECT 
        i.itemID,
        i.stockCount,
        c.name AS name,
        c.model AS model,
        c.brand AS brand,
        c.visionType AS visionType,
        c.price AS price
      FROM inventory i
      JOIN eyecontacts c ON i.contactID = c.contactID
    `);

    const formattedContacts = contacts.map(item => ({
      itemID: item.itemID,
      type: 'Contact',
      name: item.name,
      model: item.model,
      brand: item.brand,
      visionType: item.visionType,
      price: parseFloat(item.price),
      stockCount: item.stockCount
    }));

    const combined = [...formattedFrames, ...formattedContacts];
    res.json(combined);
  } catch (err) {
    console.error("Failed to fetch inventory:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;


