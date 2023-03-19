const express = require("express");
const connectDB = require("./config/db");
const Test = require("./models/testModel");

// cores required for other domains to call our api urls
const cors = require("cors");

// call to connect to our database
connectDB();

//use express functions
const app = express();

// cor needed for other domains to access these api
app.use(cors());

app.use(express.json());

// call this function when doing a http get request to this url
app.get("/testPost", (req, res) => {
  res.send("working");
});
// call this function when doing a http post request to this url
app.post("/testPost", async (req, res) => {
  const fake = new Test({ user: "john doe", age: 39 });
  await fake.save();
  res.status(201).send({ message: "success" });
});
//-----------------------------

// server host on port 4000
app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
