/** @format */
const jwt = require("jsonwebtoken");
const userModel = require("../models/BP_userModel");

/**
 * Verifies the presence and validity of the authorization token in the request headers.
 * If valid, it sets the loginId on the request object and calls the next middleware function.
 * If invalid, it returns a JSON response with the appropriate status code and error message.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.locals.message = "Token is required";
    return res.status(401).json({ message: res.locals.message });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.locals.message = "Unauthorized";
      return res.status(401).json({ message: res.locals.message });
    }

    req.loginId = decoded.loginId;
    next();
  });
};

// Add User
exports.addUserData = [
  verifyToken,
  (req, res) => {
    const { userId, firstname, lastname, phone, address, pincode } = req.body;
    const userData = {
      userId,
      loginId: req.loginId,
      firstname,
      lastname,
      phone,
      address,
      pincode,
    };
    res.locals.triggerPerson = req.loginId;
    userModel.addUserData(userData, (err, result) => {
      if (err) {
        res.locals.message = err.message.includes("already exists")
          ? err.message
          : "Insert failed";
        const status = err.message.includes("already exists") ? 409 : 500;
        return res.status(status).json({ message: res.locals.message });
      }

      res.locals.message = "Data added successfully";
      res.status(201).json({
        message: res.locals.message,
        triggeredby: req.loginId,
      });
    });
  },
];

// Update User
exports.updateUserData = [
  verifyToken,
  (req, res) => {
    const { userId, firstname, lastname, phone, address, pincode } = req.body;
    const updatedData = { firstname, lastname, phone, address, pincode };
    res.locals.triggerPerson = req.loginId;

    userModel.updateUserData(userId, updatedData, (err, result) => {
      if (err) {
        res.locals.message = err.message.includes("already exists")
          ? err.message
          : "Update failed";
        const status = err.message.includes("already exists") ? 409 : 500;
        return res.status(status).json({ message: res.locals.message });
      }

      res.locals.message = "User data updated successfully";
      res.status(200).json({
        message: res.locals.message,
        triggeredby: req.loginId,
      });
    });
  },
];

// Delete User
exports.deleteUserData = [
  verifyToken,
  (req, res) => {
    const { userId } = req.body;
    res.locals.triggerPerson = req.loginId;
    if (!userId) {
      res.locals.message = "userId is required";
      return res.status(400).json({ message: res.locals.message });
    }

    userModel.deleteUserData(userId, (err, result) => {
      if (err) {
        res.locals.message = "Delete failed";
        return res.status(500).json({ message: res.locals.message });
      }

      res.locals.message = `User with ID ${userId} deleted successfully`;
      res.status(200).json({
        message: res.locals.message,
        triggeredby: req.loginId,
      });
    });
  },
];

// View User
exports.viewUserData = [
  verifyToken,
  (req, res) => {
    const { userId } = req.body;
    res.locals.triggerPerson = req.loginId;
    if (!userId) {
      res.locals.message = "userId is required";
      return res.status(400).json({ message: res.locals.message });
    }

    userModel.getUserData(userId, (err, result) => {
      if (err) {
        res.locals.message = "Fetch failed";
        return res.status(500).json({ message: res.locals.message });
      }

      if (!result) {
        res.locals.message = "User not found";
        return res.status(404).json({ message: res.locals.message });
      }

      res.locals.message = "Data retrieved";
      res.status(200).json({
        message: res.locals.message,
        triggeredby: req.loginId,
        data: result,
      });
    });
  },
];
