const express = require('express');
const router = express.Router();
const db = require('../config/dj');

router.get('/getNotifications', async (req, res) => {
  const { recipientID, recipientRole } = req.query;

  if (!recipientID || !recipientRole) {
    return res.status(400).json({ success: false, error: 'Missing recipientID or recipientRole' });
  }

  const query = `SELECT * FROM notifications WHERE recipientID = ? AND recipientRole = ? ORDER BY createdAt DESC`;
  
  try {
    db.query(query, [recipientID, recipientRole], (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      res.status(200).json({ success: true, notifications: results });
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Failed to get notifications' });
  }
});

module.exports = router;
