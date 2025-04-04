const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/createNotification', async (req, res) => {
  const { recipientID, recipientRole, message, type } = req.body;

  if (!recipientID || !recipientRole || !message || !type) {
    return res.status(400).send({ success: false, error: 'Missing required fields' });
  }

  
  const insertQuery = `
    INSERT INTO notifications (recipientID, recipientRole, message, type)
    VALUES (?, ?, ?, ?)`;

  try {
    db.query(insertQuery, [recipientID, recipientRole, message, type], (err, result) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).send({ success: false, error: 'Database error' });
      }
      res.status(201).send({
        success: true,
        message: 'Notification added',
        notificationID: result.insertId
      });
    });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).send({ success: false, error: 'Failed to add notification' });
  }
});

module.exports = router;
