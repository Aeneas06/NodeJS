/** @format */

const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using the URI
 * specified in the environment variables. Logs a success message
 * if the connection is successful, otherwise logs the error and
 * exits the process with a failure status.
 *
 * @async
 * @throws Will exit the process if the connection fails.
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

/**
 * Disconnects the MongoDB connection.
 * @async
 * @throws Will log the error but not exit the process.
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
