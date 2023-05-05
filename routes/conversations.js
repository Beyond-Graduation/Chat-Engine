const express = require("express");

const router = express.Router();

const Conversation = require("../models/Conversation");
const User = require("../models/User");

router.post("/conversations", async (req, res) => {
  const newConversation = new Conversation({
    member: [req.body.senderId, req.body.receiverId],
  });

  try {
    const users = await User.find({
      $or: [{ userId: req.body.senderId }, { userId: req.body.receiverId }],
    });

    if (users.length === 2) {
      if (users[0].__t === users[1].__t) {
        res
          .status(400)
          .json({ error: "Users of the same type are not allowed to chat" });
      } else {
        const exists = await Conversation.find({
          $or: [
            { member: { $eq: [req.body.senderId, req.body.receiverId] } },
            { member: { $eq: [req.body.receiverId, req.body.senderId] } },
          ],
        });
        if (exists.length === 0) {
          const savedConversation = await newConversation.save();
          res.status(200).json(savedConversation);
        } else {
          res.status(200).json(exists[0]);
        }
      }
    } else {
      res.status(400).json({ error: "Invalid Users" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/conversations/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      member: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
