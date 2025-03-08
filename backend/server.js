const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const db = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stations", require("./routes/stationRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
