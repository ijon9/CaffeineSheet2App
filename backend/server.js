const express = require("express");
const connectDB = require("./config/db");
// may need cors later. Have to see
const cors = require("cors");

connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("working");
});

app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
