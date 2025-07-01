/** @format */

const jwt = require("jsonwebtoken");

/**
 * Verify that the request has a valid JWT token in its Authorization header.
 * Extracts the user data from the token and assigns it to the request object.
 * If the token is invalid or missing, returns a 401 Unauthorized response.
 *
 * @function verifyToken
 * @param {import("express").Request} req Request object
 * @param {import("express").Response} res Response object
 * @param {import("express").NextFunction} next Next middleware function
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
