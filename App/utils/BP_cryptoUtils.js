/** @format */

const crypto = require("crypto");

// Generate 32-byte key (as 64-character hex string)
function generateRandomKey() {
  return crypto.randomBytes(32).toString("hex");
}

// Encrypt plaintext using AES-256-CBC
function encryptAES(plainText, hexKey) {
  const key = Buffer.from(hexKey, "hex"); // 32 bytes
  const iv = crypto.randomBytes(16); // 16 bytes

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"), // 32-character hex string
  };
}

// Decrypt encrypted text using AES-256-CBC
function decryptAES(encryptedText, hexKey, ivHex) {
  const key = Buffer.from(hexKey, "hex"); // 32 bytes
  const iv = Buffer.from(ivHex, "hex"); // 16 bytes

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = {
  encryptAES,
  decryptAES,
  generateRandomKey,
};
