const express = require('express');
const router = express.Router();
const db = require('../../db');

// Bulk restock for all low-stock items (frames + eyecontacts)
router.post('/restock', async (req, res) => {
  const LOW_THRESHOLD = 5;
  const RESTOCK_AMOUNT = 10;

  try {
    await db.promise().query(
      `UPDATE frames SET stockCount = ? WHERE stockCount < ?`,
      [RESTOCK_AMOUNT, LOW_THRESHOLD]
    );

    await db.promise().query(
      `UPDATE eyecontacts SET stockCount = ? WHERE stockCount < ?`,
      [RESTOCK_AMOUNT, LOW_THRESHOLD]
    );

    res.json({ message: "Restock completed for low-stock items." });
  } catch (err) {
    console.error("Error during restock:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Restock a specific item (frame or contact)
router.post('/order-most-purchased', async (req, res) => {
  const { itemID, itemType, restockAmount } = req.body;

  try {
    let table = "";
    let idField = "";

    if (itemType === "frame") {
      table = "frames";
      idField = "frameID";
    } else if (itemType === "contact") {
      table = "eyecontacts";
      idField = "contactID";
    } else {
      return res.status(400).json({ error: "Invalid itemType" });
    }

    const updateQuery = `
      UPDATE ${table}
      SET stockCount = stockCount + ?
      WHERE ${idField} = ?
    `;

    await db.promise().query(updateQuery, [restockAmount, itemID]);
    res.json({ message: "Restocked successfully" });
  } catch (err) {
    console.error("Failed to restock:", err);
    res.status(500).json({ error: "Failed to restock item." });
  }
});

module.exports = router;
