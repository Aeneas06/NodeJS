/** @format */

const User = require("../models/user");
const Pet = require("../models/pet");
const generateToken = require("../utils/generatetoken");

/**
 * Registers a new user in the system.
 * @param {string} username - The new username. Must be unique.
 * @returns {object} - The newly created user object with id and username
 * @throws {400} - If the username is missing or invalid
 * @throws {409} - If the username already exists in the system
 * @throws {500} - If there is a server error
 */
exports.registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const newUser = new User({ username });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Authenticates a user and logs them in. Returns a JSON Web Token (JWT)
 * valid for 1 hour. If the user has a pet, a welcome message is included.
 * @param {string} username - The username to authenticate
 * @returns {object} - The response object with the following properties:
 *   - `userId`: the ID of the logged in user
 *   - `token`: the JWT token to use for subsequent requests
 *   - `message`: a welcome message with a reference to their pet (if any)
 * @throws {400} - If the username is missing or invalid
 * @throws {404} - If the user is not found
 * @throws {500} - If there is a server error
 */
exports.loginUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = generateToken(user);
    const pet = await Pet.findOne({ userId: user._id });

    let message;

    if (pet) {
      message = `🐾 Welcome back, ${user.username}! Your pet ${pet.name} has been waiting for you. Go say hi! 💬`;
    } else {
      message = `🎉 Welcome back, ${user.username}! You don't have a pet yet — why not adopt one and start your journey? 🐣`;
    }

    res.status(200).json({
      userId: user._id,
      token,
      message,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
