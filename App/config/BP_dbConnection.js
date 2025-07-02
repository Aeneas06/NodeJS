/** @format */

const mysql = require("mysql2");

// Database configuration
const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(connectionConfig);

function connectToDatabase(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting a connection from the pool:", err.message);
      callback(err, null);
      return;
    }
    console.log("Database connection established.");
    callback(null, connection);
  });
}

function testDatabaseConnection(callback) {
  connectToDatabase((err, connection) => {
    if (err) {
      console.error("Database connection test failed:", err.message);
      callback(err);
      return;
    }

    connection.ping((pingErr) => {
      connection.release();
      if (pingErr) {
        console.error("Database ping test failed:", pingErr.message);
        callback(pingErr);
        return;
      }
      console.log("Database connection test successful.");
      callback(null);
    });
  });
}

function closeDatabasePool(callback) {
  pool.end((err) => {
    if (err) {
      console.error("Error closing the database pool:", err.message);
      callback(err);
      return;
    }
    console.log("Database pool closed.");
    callback(null);
  });
}

module.exports = {
  connectToDatabase,
  testDatabaseConnection,
  closeDatabasePool,
};
