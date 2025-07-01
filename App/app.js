/** @format */

const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/BP_authRoutes");
const userRoutes = require("./routes/BP_userRoutes");
const logger = require("./middlewares/BP_logger");

dotenv.config();
const app = express();

app.use(logger);

app.use(express.json());
app.use("/api/bp/", authRoutes);
app.use("/api/bp/", userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
