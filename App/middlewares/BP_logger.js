/** @format */
const fs = require("fs");

const logger = (req, res, next) => {
  res.on("finish", () => {
    const logEntry = `${new Date().toISOString()} : ${req.method} ${
      req.originalUrl
    } : ${res.statusCode} : ${res.locals.message || "No message"} : ${
      req.user?.loginId || res.locals.triggerPerson || "Unknown"
    }\n`;

    fs.appendFile("BP_log.txt", logEntry, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  });

  next();
};

module.exports = logger;
