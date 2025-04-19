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

  if (!itemID || !itemType || !restockAmount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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

    // First check if the item exists
    const [existingItem] = await db.query(
      `SELECT stockCount FROM ${table} WHERE ${idField} = ?`,
      [itemID]
    );

    if (!existingItem || existingItem.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Perform the update
    const [result] = await db.query(
      `UPDATE ${table} SET stockCount = stockCount + ? WHERE ${idField} = ?`,
      [restockAmount, itemID]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Failed to update stock count" });
    }

    // Get the updated stock count
    const [updatedItem] = await db.query(
      `SELECT stockCount FROM ${table} WHERE ${idField} = ?`,
      [itemID]
    );
    
    res.json({ 
      message: "Restocked successfully",
      newStockCount: updatedItem[0].stockCount
    });
  } catch (err) {
    console.error("Failed to restock:", err);
    res.status(500).json({ 
      error: "Failed to restock item",
      details: err.message 
    });
  }
});

module.exports = router;
