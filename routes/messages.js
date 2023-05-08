const express = require("express");

const router = express.Router();

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

router.post("/messages", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    await Conversation.updateOne(
      { _id: req.body.conversationId },
      { lastMessageAt: Date.now() }
    );
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
