const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Get All Charging Stations
router.get("/", (req, res) => {
  db.query("SELECT * FROM charging_stations", (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
});

// Add New Charging Station (Admin Only)
router.post("/", (req, res) => {
  const { name, location, latitude, longitude, voltage, price, availability } = req.body;

  db.query(
    "INSERT INTO charging_stations (name, location, latitude, longitude, voltage, price, availability) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, location, latitude, longitude, voltage, price, availability],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Charging Station Added" });
    }
  );
});

module.exports = router;
