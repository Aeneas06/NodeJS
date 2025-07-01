/** @format */
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware to authenticate a request by verifying the presence and validity of
 * the authorization token in the request headers.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.locals.message = "Token missing";
    res.locals.triggerPerson = "Unknown";
    return res.status(401).json({ message: res.locals.message });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.locals.message = "Token invalid or expired";
      res.locals.triggerPerson = "Unknown";
      return res.status(403).json({ message: res.locals.message });
    }

    req.user = user;
    req.loginId = user.loginId || user.userId || "Unknown";
    res.locals.triggerPerson = req.loginId;
    next();
  });
};

module.exports = authenticateToken;
