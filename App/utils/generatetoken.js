/** @format */

const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for the given user.
 * @param {import("../models/user")} user
 * @returns {string} The generated JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = generateToken;
