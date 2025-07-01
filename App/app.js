/** @format */

const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/BP_authRoutes");
const userRoutes = require("./routes/BP_userRoutes");
const logger = require("./middlewares/BP_logger");
const globalLimiter = require("./middlewares/BP_ratelimiter");

dotenv.config();
const app = express();

app.use(logger);
app.use(globalLimiter);

app.use(express.json());
app.use("/api/bp/", authRoutes);
app.use("/api/bp/", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
