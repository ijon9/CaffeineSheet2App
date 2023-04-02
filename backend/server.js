const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const User = require("./models/userModel");
const Column = require("./models/columnModel");
const View = require("./models/viewModel");
const DView = require("./models/dViewModel");
const TView = require("./models/tViewModel");
const DataSource = require("./models/dataSourceModel");

const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");

const { google } = require("googleapis");
const sheets = google.sheets("v4");

const App = require("./models/appModel");
const app = express();

const client = new OAuth2Client(
  "475033388248-6sa0d0q32qh2mg9kuvk729tbe5lu22lq.apps.googleusercontent.com",
  "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",
  "http://localhost:3000"
);

// cores required for other domains to call our api urls
const cors = require("cors");
const { table } = require("console");

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
    res.status(404).send("YOU ARE NOT AUTHENTICATED");
  }
};

app.get("/getUser", isAuth, async (req, res) => {
  const sessionid = req.session.id;
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
  const createdapp = new App({
    name: name,
    creator: creator,
    roleSheet: rolesheet,
    published: publish === "yes" ? true : false,
  });
  await createdapp.save();
  res.send("Added app");
});

app.post("/getApps", async (req, res) => {
  const email = req.body.email;
  const apps = await App.find({ creator: email });
  res.send(apps);
});

app.post("/getOneApp", async (req, res) => {
  const appId = req.body.id;
  const app = await App.findOne({ _id: appId });
  res.send(app);
});

app.post("/editApp", async (req, res) => {
  const { appId, name, creator, roleSheet, publish } = req.body;
  await App.findOneAndUpdate(
    { _id: appId },
    {
      name: name,
      creator: creator,
      roleSheet: roleSheet,
      published: publish === "yes" ? true : false,
    }
  );
  res.send("Edited app");
});

app.post("/addTableView", async (req, res) => {
  const { name, datasource, columns } = req.body.data;
  const { selectApp, appId } = req.body;
  let selectedDS;
  for (let ds of selectApp.dataSources) {
    if (ds.name == datasource) {
      selectedDS = ds;
    }
  }
  let cols = [];

  let letters = columns.split("/");

  for (tableDS of selectedDS.columns) {
    if (letters.includes(tableDS.colLetter)) {
      cols.push(tableDS);
    }
  }

  let tview = new View({
    name: name,
    columns: cols,
    viewType: "table",
  });

  await tview.save();
  const currApp = await App.findOne({ _id: appId });
  let tableModal = TView({
    view: tview,
  });
  await tableModal.save();

  let tables = currApp.tViews;
  tables.push(tableModal);
  await App.findOneAndUpdate({ _id: appId }, { tViews: tables }, { new: true });
  res.send(tableModal);
});

app.post("/getTableViews", async (req, res) => {
  res.send("okie");
});

function getColumnLetter(columnNumber) {
  let dividend = columnNumber;
  let columnLetter = "";
  let modulo;

  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    columnLetter = String.fromCharCode(65 + modulo) + columnLetter;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnLetter;
}
//-----------------------------
app.post("/addDataSource", async (req, res) => {
  const { appId, name, url } = req.body;
  const sheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = url.split("/")[5];
  const gid = parseInt(url.split("gid=")[1]);

  const { data } = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: true,
  });

  let title = "";
  for (let d of data.sheets) {
    if (d.properties.sheetId == gid) {
      title = d.properties.title;
    }
  }

  const sheetdata = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${title}'!A:Z`,
    majorDimension: "COLUMNS",
    valueRenderOption: "FORMATTED_VALUE",
  });

  let list_column = [];

  for (let i = 0; i < sheetdata.data.values.length; i++) {
    console.log(sheetdata.data.values[i]);
    let letter = getColumnLetter(i + 1);
    let colprop = new Column({
      colLetter: letter,
      initialValue: "",
      label: false,
      reference: "",
      type: "",
      key: false,
    });
    await colprop.save();
    list_column.push(colprop);
  }

  //--------------------------
  const dataSource = new DataSource({
    name: name,
    url: url,
    sheetIndex: gid,
    columns: list_column,
    key: false,
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
  res.send(dataSource);
});

app.post("/getDataSource", async (req, res) => {
  console.log(req.body);
  const dataSourceID = req.body.dataSourceID;
  const dsource = await DataSource.findOne({ _id: dataSourceID });
  res.send(dsource);
});

app.post("/editDataSource", async (req, res) => {
  const { appId, dsId, name, url, cols } = req.body;
  const app = await App.findOne({ _id : appId });
  var dSources = app.dataSources;
  for(var i=0; i<dSources.length; i++) {
    if(dSources[i]._id.toString() === dsId) {
      dSources[i].name = name;
      dSources[i].url = url;
      dSources[i].columns = cols;
    }
  }
  await App.findOneAndUpdate(
    { _id: appId }, { dataSources : dSources }
  );
  for(var i=0; i<cols.length; i++) {
    await Column.findOneAndUpdate(
      {_id : cols[i]._id}, 
      { 
        colLetter : cols[i].colLetter,
        initialValue : cols[i].initialValue,
        label : cols[i].label,
        reference : cols[i].reference,
        type : cols[i].type
      }
    )
  }
  await DataSource.findOneAndUpdate(
    { _id: dsId }, { name: name, url: url, columns: cols }
  );
  res.send("Edited Data Source");
});

app.post("/getDataSources", async (req, res) => {
  const appId = req.body.appId;
  const app = await App.findOne({ _id: appId });
  const dsources = app.dataSources;
  res.send(dsources);
});

//------------better api auth code----------
app.post("/logUser", async (req, res) => {
  const auth_code = req.body.code;
  const { tokens } = await client.getToken(auth_code);
  const accessToken = tokens.access_token;
  const refreshToken = tokens.refresh_token;

  const people = google.people({
    version: "v1",
    auth: client,
  });
  client.setCredentials({ access_token: accessToken });
  let results = await people.people.get({
    resourceName: "people/me",
    personFields: "names,emailAddresses",
  });

  let displayName = results.data.names[0].displayName;
  let email = results.data.emailAddresses[0].value;

  const existingUser = await User.findOne({ email });
  req.session.isAuth = true;
  if (!existingUser) {
    const user = new User({
      name: displayName,
      email: email,
      sessionid: req.session.id,
      refreshToken: refreshToken,
    });
    await user.save();
    client.setCredentials({ refresh_token: refreshToken });
    res.status(201).send({ message: "success", name: displayName });
  } else {
    await User.findOneAndUpdate(
      { email: email },
      { sessionid: req.session.id },
      { new: true }
    );
    client.setCredentials({ refresh_token: existingUser.refreshToken });
    res.status(201).send({ message: "already in db", name: displayName });
  }
});

// server host on port 4000
app.listen(4000, () => {
  console.log("Server Listening on port 4000");
});
