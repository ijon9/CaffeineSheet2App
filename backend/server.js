const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const Test = require("./models/testModel");
const User = require("./models/userModel");
const Column = require("./models/columnModel");
const View = require("./models/viewModel");
const DView = require("./models/dViewModel");
const TView = require("./models/tViewModel");
const DataSource = require("./models/dataSourceModel");
const App = require("./models/appModel");
const app = express();

// cores required for other domains to call our api urls
const cors = require("cors");

// call to connect to our database
connectDB();

//use express functions
app.use(
  session({
    secret: "sheet2app",
    resave: false,
    saveUninitialized: false,
  })
);

// cor needed for other domains to access these api
app.use(
  cors({
    origin: ["http://localhost:3000"],
    method: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    console.log("this is running?");
    res.status(404).send("YOU ARE NOT AUTHENTICATED");
  }
};

app.post("/addUser", async (req, res) => {
  const { name, email } = req.body;
  const existingUser = await User.findOne({ email });
  req.session.isAuth = true;
  if (!existingUser) {
    const user = new User({
      name: name,
      email: email,
      sessionid: req.session.id,
    });
    await user.save();
    res.status(201).send({ message: "success" });
  } else {
    await User.findOneAndUpdate(
      { email: email },
      { sessionid: req.session.id },
      { new: true }
    );
    res.status(201).send({ message: "already in db" });
  }
});

app.get("/getUser", isAuth, async (req, res) => {
  const sessionid = req.session.id;
  // console.log(sessionid);
  const userSessionid = await User.findOne({ sessionid });
  res.send(userSessionid.email);
});

app.post("/logout", async (req, res) => {
  const useremail = req.body.email;
  await User.findOneAndUpdate(
    { email: useremail },
    { sessionid: "" },
    { new: true }
  );
  req.session.isAuth = false;
  res.status(200).send("logging out");
});

app.post("/addApp", async (req, res) => {
  const {name, creator, rolesheet, publish} = req.body;
  const app = new App({
    name: name,
    creator: creator,
    rolesheet: rolesheet,
    published: publish === "yes" ? true : false
  });
  await app.save();
  res.send("Added app");
})

app.post("/getApps", async (req, res) => {
  const email = req.body.email;
  const apps = await App.find({ creator: email });
  console.log(email)
  res.send(apps);
})
//-----------------------------
app.post("/addDataSource", async (req, res) => {
  const {name, url, sheetIndex} = req.body;
  const dataSource = new DataSource({
    name: name,
    url: url,
    sheetIndex: sheetIndex
  });
  await dataSource.save();
  res.send("Added datasource");
})

// server host on port 4000
app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
