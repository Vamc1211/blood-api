const express = require("express");
const connection = require("../config/database");
const { authenticateandAuth } = require("../auth/auth");
const jwt = require("jsonwebtoken");

// Add body parser middleware if necessary
const router = express.Router();

// Route for user signup
router.post("/signup", (req, res) => {
  let user = req.body;

  let query = "select email from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        let query =
          "insert into user(FirstName,LastName,Email,MobileNumber,City,Pincode) values(?, ?, ?, ?, ?,?)";

        connection.query(
          query,
          [user.name, user.name, user.email, user.mobile, user.city, user.pincode],
          (err, results) => {
            if (!err) {
              return res.status(200).json({
                message: "Successfully registered",
              });
            } else {
              return res.status(500).json({ err });
            }
          }
        );
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      return res.status(500).json({ err });
    }
  });
});

// Route for user login
router.post("/login", (req, res) => {
  let user = req.body;

  let tableName = user.userType;

  if (!tableName) {
    return res.status(400).json({ message: "Invalid usertype" });
  }

  let query = `SELECT password ,email FROM ${tableName} WHERE Email = ?`;
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        if (results[0].password != user.password) {
          return res.status(500).json({ message: "Password does not match" });
        } else {
          const accessToken = jwt.sign(
            {
              userType: tableName,
              email: results[0].email
            },
            process.env.SECRET,
            {
              expiresIn: "1h"
            }
          );

          return res.status(200).json({ accessToken });
        }
      } else {
        return res.status(500).json({ message: "User does not exist" });
      }
    } else {
      return res.status(500).json({ err });
    }
  });
});

// Route to get availability of blood in hospitals
router.get('/avail', authenticateandAuth('user'), (req, res) => {
  const sql = `
    SELECT H.HName, B.GroupName, BR.Quantity, H.city
    FROM Hospital H
    JOIN BloodRecords BR ON H.Hid = BR.Hid
    JOIN BloodGroup B ON B.Bid = BR.Bid
  `;
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing the query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {
      return res.json(results);
    }
  });
});

module.exports = router;
