/** @format */

require("dotenv").config();
const express = require("express");
const { connectDB, disconnectDB } = require("./config/db");
const petRoutes = require("./routes/petroute");
const userRoutes = require("./routes/userroute");

const app = express();
app.use(express.json());

app.use("/dino/user", userRoutes);
app.use("/dino/pet", petRoutes);

const PORT = process.env.PORT || 3000;

/**
 * Starts the server and sets up listeners for SIGINT and SIGTERM
 * events to gracefully shut down the server.
 */
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} 🚀`)
  );

  /**
   * Closes the server and disconnects from the database
   * in response to a SIGINT or SIGTERM event.
   *
   * @async
   * @returns {Promise<void>}
   */
  const gracefulShutdown = async () => {
    console.log("\n🛑 Shutting down server...");
    await disconnectDB();
    server.close(() => {
      console.log("💥 Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
};

startServer();
