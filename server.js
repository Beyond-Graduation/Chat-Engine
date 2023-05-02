require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const conversationsRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");

const mongoString = process.env.DATABASE_URL;
const app = express();

mongoose.connect(mongoString);
const database = mongoose.connection;

app.use(cors());
app.use(express.json());

// database.on('error', (error) => {
//     console.log(error)
// })

database.once("connected", () => {
  console.log("Database Connected");
});

app.use("/api", conversationsRoute);
app.use("/api", messagesRoute);

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Socket creation

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    // console.log("A user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    // console.log(users);
    io.emit("getUsers", users);
  });

  //send and get messages
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    const senderId = data.senderId;
    const text = data.text;
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  socket.on("disconnect", () => {
    // console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
