/** @format */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/BP_userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /addUserData:
 *   post:
 *     summary: Add new user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - firstname
 *             properties:
 *               userId:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 *       500:
 *         description: Insert failed
 */
router.post("/addUserData", userController.addUserData);

/**
 * @swagger
 * /updateUserData:
 *   put:
 *     summary: Update existing user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Update failed
 */
router.put("/updateUserData", userController.updateUserData);

/**
 * @swagger
 * /deleteUserData:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Delete failed
 */
router.delete("/deleteUserData", userController.deleteUserData);

/**
 * @swagger
 * /viewUserData:
 *   post:
 *     summary: View user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Fetch failed
 */
router.post("/viewUserData", userController.viewUserData);

module.exports = router;
