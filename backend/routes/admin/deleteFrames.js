const express = require('express');
const router = express.Router();
const db = require('../../db');

router.delete('/frames/:id', (req, res) => {
  const frameID = req.params.id;
  const query = 'DELETE FROM frames WHERE frameID = ?';

  db.query(query, [frameID], (err, result) => {
    if (err) {
      console.error('Error deleting frame:', err);
      return res.status(500).json({ error: 'Failed to delete frame' });
    }
    res.status(200).json({ message: 'Frame deleted successfully' });
  });
});

module.exports = router;
