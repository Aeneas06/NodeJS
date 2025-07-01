/** @format */

const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
  name: { type: String, required: true, unique: true },
  animalType: { type: String, required: true },
  nature: { type: String, required: true },
  color: { type: String },
  dress: { type: String },
  language: { type: String, default: "English" },
  speakingStyle: { type: String, default: "friendly" },
  mood: { type: String, default: "happy" },
  affection: { type: Number, default: 0 },
  lastInteraction: { type: Date, default: Date.now },
});

module.exports = mongoose.model("pets", PetSchema);
