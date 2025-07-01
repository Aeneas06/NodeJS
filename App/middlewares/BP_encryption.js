/** @format */

const { encryptAES, generateRandomKey } = require("../utils/BP_cryptoUtils");

/**
 * Middleware to encrypt password using AES-256-CBC.
 * Adds encrypted password, passkey, and IV to the request body.
 * Also sets logging context in res.locals.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
function encryptPassword(req, res, next) {
  const { password, loginId } = req.body;

  if (!password) {
    res.locals.message = "Password is required";
    res.locals.triggerPerson = loginId || "Unknown";
    return res.status(400).json({ message: res.locals.message });
  }

  try {
    const passkey = generateRandomKey();
    const keyBuffer = Buffer.from(passkey, "hex");

    const { encryptedData, iv } = encryptAES(password, keyBuffer);

    req.body.password = encryptedData;
    req.body.passkey = passkey;
    req.body.iv = iv;

    res.locals.message = "Password encrypted successfully";
    res.locals.triggerPerson = loginId || "Unknown";

    next();
  } catch (error) {
    res.locals.message = "Encryption failed";
    res.locals.triggerPerson = loginId || "Unknown";
    return res.status(500).json({ message: res.locals.message, error: error.message });
  }
}

module.exports = {
  encryptPassword,
};