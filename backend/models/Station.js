const db = require("../config/db");

const createStationTable = () => {
  const query = `CREATE TABLE IF NOT EXISTS charging_stations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      location VARCHAR(255),
      latitude FLOAT,
      longitude FLOAT,
      voltage VARCHAR(50),
      price DECIMAL(10,2),
      availability INT
  )`;
  db.query(query, (err, result) => {
    if (err) console.log(err);
    else console.log("Charging Station Table Created");
  });
};

createStationTable();
