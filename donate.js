const express = require("express");
const connection = require("../config/database");
const router = express.Router();

const { authenticateandAuth } = require("../auth/auth");

// Route for adding donor information
router.post('/donate',authenticateandAuth, (req, res) => {
  const { name, bloodGroup, contactNumber, city, message } = req.body;

  // Validate required fields
  if (!name || !bloodGroup || !contactNumber || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert donor information into the database
  const query = 'INSERT INTO donor (name, bloodgroup, mobileNumber, city, message) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, bloodGroup, contactNumber, city, message], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error saving donor data' });
    }

    return res.status(201).json({ message: 'Donor data saved successfully' });
  });
});

// Route for fetching donor details
router.get('/donors',authenticateandAuth, (req, res) => {
  const query = 'SELECT * FROM donor';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch donor details:', err);
      res.status(500).json({ error: 'Failed to fetch donor details' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
