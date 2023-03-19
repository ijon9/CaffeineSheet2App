const express = require("express");
const connectDB = require("./config/db");
const Test = require("./models/testModel");
// may need cors later. Have to see
const cors = require("cors");
// const { testGet, testPost } = require("./controllers/testController");

connectDB();
const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("working");
// });

app.post("/testPost", async (req, res) => {
  console.log("testing this works");
  const fake = new Test({ user: "john doe" });
  await fake.save();
  res.status(201).send({ message: "success" });
});

app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
