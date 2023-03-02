require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const conversationsRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");

const mongoString = process.env.DATABASE_URL;
const app = express();

mongoose.connect(mongoString);
const database = mongoose.connection;

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
