const db = require("../config/db");

const createUserTable = () => {
  const query = `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role ENUM('user', 'admin') DEFAULT 'user'
  )`;
  db.query(query, (err, result) => {
    if (err) console.log(err);
    else console.log("User Table Created");
  });
};

createUserTable();
