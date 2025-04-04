const express = require('express');
const router = express.Router();
const db = require('../../db');


router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM employee WHERE employeeID = ?', [id], (err, result) => {
      if (err) {
        console.error('Error deleting employee:', err);
        return res.status(500).json({ error: 'Failed to delete employee' });
      }
      res.json({ message: 'Employee deleted successfully' });
    });
  });module.exports = router;
  