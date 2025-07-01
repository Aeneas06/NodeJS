/** @format */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/BP_authController");
const { encryptPassword } = require("../middlewares/BP_encryption");
const { decryptPassword } = require("../middlewares/BP_decryption");

router.post("/register", encryptPassword, authController.register);
router.post("/login", decryptPassword, authController.login);

module.exports = router;
