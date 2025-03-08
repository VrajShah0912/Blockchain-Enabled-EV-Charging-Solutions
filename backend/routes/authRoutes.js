const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role || "user"],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "User Registered" });
    }
  );
});

// Login User
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
});

module.exports = router;
