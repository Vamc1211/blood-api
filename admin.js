const express = require("express");
const connection = require("../config/database");
const router = express.Router();
const { authenticateandAuth } = require("../auth/auth");

// Route to get details of all blood groups
router.get('/blood/details', authenticateandAuth('admin'), (req, res) => {
  const sql = `
    SELECT BloodGroup.Bid, BloodGroup.GroupName, BloodRecords.Quantity
    FROM BloodRecords
    JOIN BloodGroup ON BloodRecords.Bid = BloodGroup.Bid
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing the query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(results);
  });
});

// Route to get details of blood groups by hospital ID
router.get('/blood/:id', authenticateandAuth('admin'), (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT BloodGroup.Bid, BloodGroup.GroupName, BloodRecords.Quantity
    FROM BloodRecords
    JOIN BloodGroup ON BloodRecords.Bid = BloodGroup.Bid
    WHERE BloodRecords.Hid = ?
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error executing the query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(results);
  });
});

module.exports = router;
