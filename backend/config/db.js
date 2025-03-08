const mysql = require("mysql2"); // Make sure this is declared only once
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed: " + err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected...");
});

module.exports = db;
