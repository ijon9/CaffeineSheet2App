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

const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");

const { google } = require("googleapis");
const sheets = google.sheets("v4");

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
  const { name, creator, rolesheet, publish } = req.body;
  const app = new App({
    name: name,
    creator: creator,
    rolesheet: rolesheet,
    published: publish === "yes" ? true : false,
  });
  await app.save();
  res.send("Added app");
});

app.post("/getApps", async (req, res) => {
  const email = req.body.email;
  const apps = await App.find({ creator: email });
  res.send(apps);
});

app.post("/getOneApp", async (req, res) => {
  const appId = req.body.appId;
  const app = await App.findOne({ _id: appId });
  res.send(app);
})

app.post("/editApp", async(req, res) => {
  const { appId, name, creator, rolesheet, publish } = req.body;
  await App.findOneAndUpdate(
    { _id: appId }, 
    { name: name, 
      creator: creator,
      roleSheet: rolesheet,
      published: publish === "yes" ? true : false
  });
  res.send("Edited app");

})

//-----------------------------
app.post("/addDataSource", async (req, res) => {
  const { appId, name, url, sheetIndex } = req.body;
  const dataSource = new DataSource({
    name: name,
    url: url,
    sheetIndex: sheetIndex,
  });
  await dataSource.save();
  const app = await App.findOne({ _id: appId });
  if (app.dataSources === undefined) {
    await App.findOneAndUpdate({ _id: appId }, { dataSources: [dataSource] });
  } else {
    var dSources = app.dataSources;
    dSources.push(dataSource);
    await App.findOneAndUpdate({ _id: appId }, { dataSources: dSources });
  }
  res.send("Added datasource");
});

app.post("/getDataSources", async (req, res) => {
  const appId = req.body.appId;
  const app = await App.findOne({ _id: appId });
  const dsources = app.dataSources;
  res.send(dsources);
});

//-------------
async function authorize() {
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  return client;
}

app.post("/tableView", async (req, res) => {
  const url = req.body.url;
  const spreadsheetId = url.split("/")[5];
  console.log("server.js(spreadsheetId) = ", spreadsheetId);
  const range = "Sheet" + req.body.range;
  console.log("server.js(range) = ", range);

  const authClient = await authorize();

  const request = {
    spreadsheetId: spreadsheetId,
    range: range,
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.values.get(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
    res.send(response);
  } catch (err) {
    console.error(err);
  }
})

// example for showing how google sheet works
app.post("/googlesheet", async (req, res) => {
  const url = req.body.url;
  const spreadsheetId = url.split("/")[5];
  console.log("server.js(spreadsheetId) = ", spreadsheetId);
  const range = "Sheet" + req.body.range;
  console.log("server.js(range) = ", range);

  const authClient = await authorize();

  const request = {
    spreadsheetId: spreadsheetId,
    range: range,
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.values.get(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
    
    res.send(response);
  } catch (err) {
    console.error(err);
  }
});

// server host on port 4000
app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
