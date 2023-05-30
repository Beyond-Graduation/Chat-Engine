const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: {
    required: true,
    type: String,
  },

  sender: {
    required: true,
    type: String,
  },

  text: {
    required: true,
    type: String,
  },

  sentAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Message", MessageSchema);
