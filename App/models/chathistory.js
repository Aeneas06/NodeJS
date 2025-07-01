/** @format */

const mongoose = require("mongoose");

const ChatHistorySchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "pets" },
  userMessage: String,
  petResponse: String,
  moodAtTime: String,
  affectionAtTime: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("chat_history", ChatHistorySchema);
