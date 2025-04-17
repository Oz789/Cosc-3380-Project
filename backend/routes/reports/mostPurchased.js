const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/most-purchased", async (req, res) => {
  try {
    const [frames] = await db.promise().query(`
      SELECT f.frameID AS id, f.name, f.brand, f.model, 'frame' AS type, f.stockCount, f.price, 
             SUM(si.quantity) as totalSold
      FROM saleItems si
      JOIN frames f ON si.itemID = f.frameID
      WHERE si.itemType = 'frame'
      GROUP BY si.itemID
    `);

    const [contacts] = await db.promise().query(`
      SELECT c.contactID AS id, c.name, c.brand, c.model, 'contact' AS type, c.stockCount, c.price, 
             SUM(si.quantity) as totalSold
      FROM saleItems si
      JOIN eyecontacts c ON si.itemID = c.contactID
      WHERE si.itemType = 'contact'
      GROUP BY si.itemID
    `);

    const allItems = [...frames, ...contacts];
    const mostPurchased = allItems.reduce((max, item) =>
      item.totalSold > max.totalSold ? item : max,
      { totalSold: 0 }
    );

    res.json(mostPurchased);
  } catch (err) {
    console.error("Failed to fetch most purchased item:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
