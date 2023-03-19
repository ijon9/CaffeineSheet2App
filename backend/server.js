const express = require("express");
const connectDB = require("./config/db");
const Test = require("./models/testModel");
const User = require("./models/userModel");
const Column = require("./models/columnModel");
const View = require("./models/viewModel");
const DView = require("./models/dViewModel");
const TView = require("./models/tViewModel");
const DataSource = require("./models/dataSourceModel");
const App = require("./models/appModel");


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
app.get("/testGet", (req, res) => {
  res.send("Success")
});

// call this function when doing a http post request to this url
app.post("/testPost", async (req, res) => {
  const fake = new Test({ user: "john doe", age: 39 });
  await fake.save();
  res.status(201).send({ message: "success" });
});

app.post("/addUser", async (req, res) => {
  // console.log(req.body);
  const { name, email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const user = new User({ name: name, email: email });
    await user.save();
    res.status(201).send({ message: "success" });
  } else {
    console.log("already in db");
    res.status(201).send({ message: "already in db" });
  }
});

app.get("/getUser", async (req, res) => {
  console.log(req.body);
  // const { name, email } = req.body;
  // const existingUser = await User.findOne({ email });
  // if (!existingUser) {
  //   const user = new User({ name: name, email: email });
  //   await user.save();
  //   res.status(201).send({ message: "success" });
  // } else {
  //   console.log("already in db");
  //   res.status(201).send({ message: "already in db" });
  // }
});
//-----------------------------

// server host on port 4000
app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
