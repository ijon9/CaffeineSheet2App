const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("working");
});

app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
