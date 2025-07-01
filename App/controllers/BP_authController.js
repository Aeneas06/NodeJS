/** @format */
const jwt = require("jsonwebtoken");
const loginModel = require("../models/BP_loginModel");
const { decryptAES } = require("../utils/BP_cryptoUtils");
const { connectToDatabase } = require("../config/BP_dbConnection");

exports.login = (req, res) => {
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

    const decryptedPassword = decryptAES(user.password, user.passkey, user.iv);

    if (decryptedPassword !== password) {
      res.locals.message = "Invalid login ID or password";
      res.locals.triggerPerson = loginId;
      return res.status(401).json({ message: res.locals.message });
    }

    const token = jwt.sign(
      { loginId: user.loginId, userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.locals.message = "Login successful";
    res.locals.triggerPerson = user.loginId;

    return res.status(200).json({
      message: res.locals.message,
      token,
      loginId: user.loginId,
      userId: user.userId,
    });
  });
};

exports.register = (req, res) => {
  const { loginId, userId, password, passkey, iv } = req.body;

  loginModel.checkLoginIdExists(loginId, (err, exists) => {
    if (err) {
      res.locals.message = "DB error";
      res.locals.triggerPerson = loginId || "Unknown";
      return res
        .status(500)
        .json({ message: res.locals.message, error: err.message });
    }

    if (exists) {
      res.locals.message = "Login ID already exists";
      res.locals.triggerPerson = loginId;
      return res.status(409).json({ message: res.locals.message });
    }

    const sql = `
      INSERT INTO BPDLOGIN (loginId, userId, password, passkey, iv)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [loginId, userId, password, passkey, iv];

    connectToDatabase((err, connection) => {
      if (err) {
        res.locals.message = "Database error";
        res.locals.triggerPerson = loginId;
        return res
          .status(500)
          .json({ message: res.locals.message, error: err.message });
      }

      connection.query(sql, values, (err, result) => {
        connection.release();

        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            res.locals.message = "Login ID already exists";
            res.locals.triggerPerson = loginId;
            return res.status(409).json({ message: res.locals.message });
          }

          res.locals.message = "Insert failed";
          res.locals.triggerPerson = loginId;
          return res
            .status(500)
            .json({ message: res.locals.message, error: err.message });
        }

        res.locals.message = "User registered successfully";
        res.locals.triggerPerson = loginId;

        res.status(201).json({ message: res.locals.message });
      });
    });
  });
};
