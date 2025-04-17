const express = require('express');
const router = express.Router();
const db = require('../db');

// Submit a new contact message
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message, status, handledByEmployeeID } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert the message into the contactus table
    const [result] = await db.query(
      `INSERT INTO contactus 
       (name, email, phone, message, status, handledByEmployeeID) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, message, status, handledByEmployeeID]
    );

    console.log('Contact message submitted:', {
      messageID: result.insertId,
      name,
      email,
      phone,
      status,
      handledByEmployeeID
    });

    res.status(201).json({
      message: 'Contact message submitted successfully',
      messageID: result.insertId
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact message',
      details: error.message
    });
  }
});

module.exports = router; 