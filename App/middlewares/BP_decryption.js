/** @format */

const { decryptAES } = require("../utils/BP_cryptoUtils");
const loginModel = require("../models/BP_loginModel");

/**
 * Middleware to validate and decrypt password.
 * Sets user info on `req.user` if valid and enriches `res.locals` for logging.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next function.
 */
function decryptPassword(req, res, next) {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    res.locals.message = "Login ID and password are required";
    res.locals.triggerPerson = "Unknown";
    return res.status(400).json({ message: res.locals.message });
  }

  loginModel.findByLoginId(loginId, (err, user) => {
    if (err) {
      res.locals.message = "DB error";
      res.locals.triggerPerson = loginId;
      return res
        .status(500)
        .json({ message: res.locals.message, error: err.message });
    }

    if (!user) {
      res.locals.message = "Invalid login ID or password";
      res.locals.triggerPerson = loginId;
      return res.status(401).json({ message: res.locals.message });
    }

    try {
      const decryptedPassword = decryptAES(
        user.password,
        user.passkey,
        user.iv
      );
      if (decryptedPassword === password) {
        req.user = user;
        req.loginId = user.loginId;
        res.locals.triggerPerson = user.loginId;
        res.locals.message = "Password match successful";
        next();
      } else {
        res.locals.message = "Invalid login ID or password";
        res.locals.triggerPerson = user.loginId;
        return res.status(401).json({ message: res.locals.message });
      }
    } catch (error) {
      res.locals.message = "Decryption failed";
      res.locals.triggerPerson = loginId;
      return res
        .status(500)
        .json({ message: res.locals.message, error: error.message });
    }
  });
}

module.exports = {
  decryptPassword,
};
