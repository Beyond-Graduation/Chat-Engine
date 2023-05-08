const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    member: {
      type: Array,
    },
    blocked: { type: Boolean, required: true, default: false },
    blockedBy: { type: String, default: "" },
    lastMessageAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
