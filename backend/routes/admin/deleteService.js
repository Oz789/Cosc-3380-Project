const express = require('express');
const router = express.Router();
const db = require('../../db');

router.delete('/services/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM services WHERE serviceID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting service:', err);
      return res.status(500).json({ message: 'Failed to delete service' });
    }
    return res.status(200).json({ message: 'Service deleted successfully' });
  });
});

module.exports = router;
