const express = require('express');
const router = express.Router();
const db = require('../../db');



router.delete('/contacts/:id', (req, res) => {
  const contactID = req.params.id;
        const query = 'DELETE FROM eyecontacts WHERE contactID = ?';

  db.query(query, [contactID], (err, result) => {
    if (err) {
    console.error('Error deleting contact lens:', err);
return res.status(500).json({ error: 'Failed to delete contact lens' });
}

 res.status(200).json({ message: 'Contact lens deleted successfully' });
  });
});

module.exports = router;
