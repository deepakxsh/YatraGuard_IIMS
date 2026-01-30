require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/auth.routes");
app.use("/api/auth", authRoutes);
app.use("/api/auth", require("./src/routes/auth.routes"));


const PORT = 5000;
app.listen(PORT, () => {
  console.log("YatraGuard Backend running on port", PORT);
});

const bookingRoutes = require("./src/routes/booking.routes");

app.use("/api/bookings", require("./src/routes/booking.routes"));

