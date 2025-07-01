/** @format */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/BP_userController");

router.post("/addUserData", userController.addUserData);
router.put("/updateUserData", userController.updateUserData);
router.delete("/deleteUserData", userController.deleteUserData);
router.post("/viewUserData", userController.viewUserData);

module.exports = router;
