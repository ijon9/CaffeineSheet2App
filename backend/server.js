const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const User = require("./models/userModel");
const Column = require("./models/columnModel");
const View = require("./models/viewModel");
const DView = require("./models/dViewModel");
const TView = require("./models/tViewModel");
const DataSource = require("./models/dataSourceModel");
const fs = require("fs");
const path = require("path");

const { OAuth2Client } = require("google-auth-library");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");

const { google } = require("googleapis");
const sheets = google.sheets("v4");

const App = require("./models/appModel");
const app = express();

const globalDeveloper =
  "https://docs.google.com/spreadsheets/d/1Wfsl5JEiRIpQRgevsqfSgCAATdXHZ1lb2cV88Q3WqXE/edit#gid=0";

const client = new OAuth2Client(
  "475033388248-6sa0d0q32qh2mg9kuvk729tbe5lu22lq.apps.googleusercontent.com",
  "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",
  "http://localhost:3000"
);

const s2aClient = new OAuth2Client(
  "475033388248-6sa0d0q32qh2mg9kuvk729tbe5lu22lq.apps.googleusercontent.com",
  "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",
  "http://localhost:3000"
);

const s2aEmail = "teamcaffeine03@gmail.com";

// TOKEN MUST BE CHANGED WHEN EXPIRED
const s2aRefreshToken =
  "1//0dIyb_9ZGTwMoCgYIARAAGA0SNwF-L9Irmuhw0gI36mCU6iNu9kr2qzUTp12Lv_wr3fNAMSvJg01bBYpXW654KzBuMtgRa_U_fPM";

s2aClient.setCredentials({ refresh_token: s2aRefreshToken });

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
    res.status(404).send("YOU ARE NOT AUTHENTICATED");
  }
};

app.get("/getUser", isAuth, async (req, res) => {
  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });
  res.send({ email: userSessionid.email });
});

app.get("/getUserAndDevType", isAuth, async (req, res) => {
  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });

  //---------

  const s2aOwnerEmail = "teamcaffeine03@gmail.com";
  if (userSessionid.email == s2aOwnerEmail) {
    res.send({ email: userSessionid.email, isDev: true });
  } else {
    const currentToken = await client.getAccessToken();
    const currentUserToken = currentToken.res.data.refresh_token;
    const s2aOwnerUser = await User.findOne({ email: s2aOwnerEmail });

    const ownerToken = s2aOwnerUser.refreshToken;
    client.setCredentials({ refresh_token: ownerToken });

    const sheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = globalDeveloper.split("/")[5];
    const gid = parseInt(globalDeveloper.split("gid=")[1]);
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
    let isDev = false;
    const developers = sheetdata.data.values[0];
    if (developers.includes(userSessionid.email)) {
      isDev = true;
    }

    client.setCredentials({ refresh_token: currentUserToken });
    //-----------

    res.send({
      email: userSessionid.email,
      isDev: isDev,
      userid: userSessionid._id,
    });
  }
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

  fs.writeFile(
    `./logs/${createdapp._id}.txt`,
    `${createdapp.name} log\n`,
    function (err) {
      if (err) throw err;
      console.log("Results Received");
    }
  );

  fs.appendFile(
    `./logs/${createdapp._id}.txt`,
    `${creator} created ${name} app\n`,
    function (err) {
      if (err) throw err;
      console.log("Data appended to file");
    }
  );

  res.send("Added app");
});

async function devInRoleSheet(rolesheet, email) {
  const sheets = google.sheets({ version: "v4", auth: s2aClient });
  const spreadsheetId = rolesheet.split("/")[5];
  const gid = parseInt(rolesheet.split("gid=")[1]);
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
  const developers = sheetdata.data.values[0];
  for (let i = 1; i < developers.length; i++) {
    if (email == developers[i]) {
      return true;
    }
  }
  return false;
}

app.post("/getApps", async (req, res) => {
  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });

  let email = userSessionid.email;
  let listOfApps = [];
  const apps = await App.find({});

  for (let app of apps) {
    if (app.creator == email) {
      listOfApps.push({ appName: app.name, appId: app._id });
    } else {
      const rolesheet = app.roleSheet;
      const inRoleSheet = await devInRoleSheet(rolesheet, email);
      if (inRoleSheet) {
        listOfApps.push({ appName: app.name, appId: app._id });
      }
    }
  }
  res.send(listOfApps);
});

app.get("/getPublishedApp", async (req, res) => {
  let published_app = [];
  const get_app = await App.find({});

  for (let apps of get_app) {
    if (apps.published) {
      published_app.push(apps);
    }
  }

  res.send(published_app);
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

app.post("/isUserInRolesheet", async (req, res) => {
  try {
    // console.log("Going in rolesheet");
    const sessionid = req.session.id;
    const userSessionid = await User.findOne({ sessionid });
    const email = userSessionid.email;

    const appId = req.body.id;
    const app = await App.findOne({ _id: appId });
    const rolesheetURL = app.roleSheet;

    const s2aOwnerEmail = "teamcaffeine03@gmail.com";
    // const currentToken = await client.getAccessToken();
    const currentUserToken = userSessionid.refreshToken;
    const s2aOwnerUser = await User.findOne({ email: s2aOwnerEmail });

    const ownerToken = s2aOwnerUser.refreshToken;
    client.setCredentials({ refresh_token: ownerToken });

    const sheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = rolesheetURL.split("/")[5];
    const gid = parseInt(rolesheetURL.split("gid=")[1]);
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

    let isUser = false;

    // const endUserColumnIndex = 1; // end users are in the second column
    // const endUsers = sheetdata.data.values[endUserColumnIndex];
    // for (let i = 1; i < endUsers.length; i++) {
    //   if (email == endUsers[i]) {
    //     console.log(endUsers[i]);
    //     isUser = true;
    //   }
    // }

    for (var i = 1; i < sheetdata.data.values.length; i++) {
      if (sheetdata.data.values[i].includes(email)) {
        isUser = true;
      }
    }

    // Set the credentials back to the current user's token
    client.setCredentials({ refresh_token: currentUserToken });

    res.send(isUser);
  } catch (error) {
    console.error("Error in /isUserInRolesheet:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/isUserARole", async (req, res) => {
  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });
  const email = userSessionid.email;

  const appId = req.body.id;
  const app = await App.findOne({ _id: appId });
  const rolesheetURL = app.roleSheet;

  const tView = await TView.findOne({ _id: req.body.tv });

  const s2aOwnerEmail = "teamcaffeine03@gmail.com";
  const currentToken = await client.getAccessToken();
  const currentUserToken = currentToken.res.data.refresh_token;
  const s2aOwnerUser = await User.findOne({ email: s2aOwnerEmail });

  const ownerToken = s2aOwnerUser.refreshToken;
  client.setCredentials({ refresh_token: ownerToken });

  const sheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = rolesheetURL.split("/")[5];
  const gid = parseInt(rolesheetURL.split("gid=")[1]);
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

  var isARole = false;
  var setOfRoles = [];
  for (let col of sheetdata.data.values) {
    if (tView.view.roles.includes(col[0]) && col.includes(email)) {
      isARole = true;
      setOfRoles.push(col[0]);
    }
  }

  // Set the credentials back to the current user's token
  client.setCredentials({ refresh_token: currentUserToken });
  res.send({ isARole: isARole, setOfRoles: setOfRoles });
});

app.post("/addTableView", async (req, res) => {
  // const { name, datasource, columns, filter, user_filter, add, edit } =
  //   req.body.data;
  const { name, datasource, roles, add, edit } = req.body.data;
  const del = req.body.data.delete;
  const { selectApp, appId } = req.body;
  let selectedDS;
  for (let ds of selectApp.dataSources) {
    if (ds.name == datasource) {
      selectedDS = ds;
    }
  }
  let cols = [];

  // let names = columns.split("/");

  // for (let col of selectedDS.columns) {
  //   if (names.includes(col.name)) {
  //     cols.push(col);
  //   }
  // }

  let fil = new Column({
    colLetter: "",
    name: "",
    initialValue: "",
    label: false,
    reference: "",
    type: "Boolean",
    key: false,
  });
  let userFil = new Column({
    colLetter: "",
    name: "",
    initialValue: "",
    label: false,
    reference: "",
    type: "String",
    key: false,
  });
  var allowed = [false, false, false];
  allowed[0] = add;
  allowed[1] = edit;
  allowed[2] = del;
  let tview = new View({
    name: name,
    roles: roles.split("/"),
    columns: cols,
    allColumns: selectedDS.columns,
    viewType: "table",
    dsurl: selectedDS.url,
    allowedActions: allowed,
  });

  await tview.save();
  const currApp = await App.findOne({ _id: appId });
  let tableModal = TView({
    view: tview,
    filter: fil,
    userFilter: userFil,
  });
  await tableModal.save();

  let tables = currApp.tViews;
  tables.push(tableModal);
  await App.findOneAndUpdate({ _id: appId }, { tViews: tables }, { new: true });

  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });
  let email = userSessionid.email;

  fs.appendFile(
    `./logs/${appId}.txt`,
    `${email} created ${name} Table View\n`,
    function (err) {
      if (err) throw err;
      console.log("Data appended to file");
    }
  );

  res.send(tableModal);
});

app.post("/addDetailView", async (req, res) => {
  var { name, roles, editFilter, editable } = req.body.data.inputs;
  const colArray = req.body.data.colArr;
  const currApp = await App.findOne({ _id: req.body.appId });
  const currTView = await TView.findOne({ _id: req.body.tv });

  roles = roles === undefined ? "" : roles;
  editable = editable === undefined ? "" : editable;

  let selectedDS;
  for (let ds of currApp.dataSources) {
    if (ds.url == currTView.view.dsurl) {
      selectedDS = ds;
    }
  }

  var cols = [];
  for (var i = 0; i < selectedDS.columns.length; i++) {
    if (colArray[i]) {
      cols.push(selectedDS.columns[i]);
    }
  }

  let view = new View({
    name: name,
    roles: roles.split("/"),
    columns: cols,
    allColumns: selectedDS.columns,
    viewType: "detail",
    dsurl: selectedDS.url,
    allowedActions: [true, true, true],
  });
  await view.save();
  let dview = DView({
    view: view,
    editFilter: editFilter,
    editableColumns: editable.split("/"),
    tView: req.body.tv,
  });
  await dview.save();

  let dviews = currApp.dViews;
  dviews.push(dview);
  await App.findOneAndUpdate(
    { _id: req.body.appId },
    { dViews: dviews },
    { new: true }
  );

  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });
  let email = userSessionid.email;

  fs.appendFile(
    `./logs/${req.body.appId}.txt`,
    `${email} created ${name} Detail View\n`,
    function (err) {
      if (err) throw err;
      console.log("Data appended to file");
    }
  );

  res.send("DView added");
});

app.post("/getDViews", async (req, res) => {
  const tViewID = req.body.tableView;
  const dViews = await DView.find({ tView: tViewID });
  res.send(dViews);
});

app.post("/getTableView", async (req, res) => {
  const tViewID = req.body.tableView;
  const tView = await TView.findOne({ _id: tViewID });
  res.send(tView);
});

app.post("/getDetailView", async (req, res) => {
  const dViewID = req.body.dv;
  const dView = await DView.findOne({ _id: dViewID });
  res.send(dView);
});

app.post("/getFirstDetailView", async (req, res) => {
  const setOfRoles = req.body.setOfRoles;
  const currApp = await App.findOne({ _id: req.body.id });
  var dView = {};
  var found = false;
  for (let curr of currApp.dViews) {
    for (let role of setOfRoles) {
      if (!found && curr.view.roles.includes(role)) {
        dView = curr;
        found = true;
      }
    }
  }
  res.send(dView);
});

app.post("/editTableView", async (req, res) => {
  const { appId, tView, roles, colArray } = req.body;
  const app = await App.findOne({ _id: appId });
  tView.view.roles = roles.split("/");
  let selectedDS;
  for (let ds of app.dataSources) {
    if (ds.url === tView.view.dsurl) {
      selectedDS = ds;
    }
  }
  var cols = [];
  for (var i = 0; i < selectedDS.columns.length; i++) {
    if (colArray[i]) {
      cols.push(selectedDS.columns[i]);
    }
  }
  tView.view.columns = cols;
  var tViews = app.tViews;
  for (var i = 0; i < tViews.length; i++) {
    if (tViews[i]._id.toString() === tView._id.toString()) {
      tViews[i] = tView;
    }
  }
  await App.findOneAndUpdate({ _id: appId }, { tViews: tViews });
  await TView.findOneAndUpdate(
    { _id: tView._id },
    { view: tView.view, filter: tView.filter, userFilter: tView.userFilter }
  );
  res.send("Edited Table View");
});

app.post("/editDetailView", async (req, res) => {
  const { appId, dView, roles, colArray, editable } = req.body;
  const app = await App.findOne({ _id: appId });
  dView.view.roles = roles.split("/");
  dView.editableColumns = editable.split("/");
  let selectedDS;
  for (let ds of app.dataSources) {
    if (ds.url === dView.view.dsurl) {
      selectedDS = ds;
    }
  }
  var cols = [];
  for (var i = 0; i < selectedDS.columns.length; i++) {
    if (colArray[i]) {
      cols.push(selectedDS.columns[i]);
    }
  }
  dView.view.columns = cols;
  var dViews = app.dViews;
  for (var i = 0; i < dViews.length; i++) {
    if (dViews[i]._id.toString() === dView._id.toString()) {
      dViews[i] = dView;
    }
  }
  await App.findOneAndUpdate({ _id: appId }, { dViews: dViews });
  await DView.findOneAndUpdate(
    { _id: dView._id },
    {
      view: dView.view,
      editFilter: dView.editFilter,
      editableColumns: dView.editableColumns,
    }
  );
  res.send("Edited Detail View");
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
  const { appId, name, url, key } = req.body;
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
    // console.log(sheetdata.data.values[i]);
    let letter = getColumnLetter(i + 1);
    let newName = sheetdata.data.values[i][0];
    let colprop = new Column({
      colLetter: letter,
      name: newName,
      initialValue: "",
      label: false,
      reference: "",
      type: "",
      key: newName === key ? true : false,
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

  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });
  let email = userSessionid.email;

  fs.appendFile(
    `./logs/${appId}.txt`,
    `${email} created ${name} datasource\n`,
    function (err) {
      if (err) throw err;
      console.log("Data appended to file");
    }
  );

  res.send(dataSource);
});

app.post("/getDataSource", async (req, res) => {
  const dataSourceID = req.body.dataSourceID;
  const dsource = await DataSource.findOne({ _id: dataSourceID });
  res.send(dsource);
});

app.post("/editDataSource", async (req, res) => {
  const { appId, dsId, name, url, cols } = req.body;
  const app = await App.findOne({ _id: appId });
  var dSources = app.dataSources;
  var thisDS = {};
  for (var i = 0; i < dSources.length; i++) {
    if (dSources[i]._id.toString() === dsId) {
      thisDS = dSources[i];
      dSources[i].name = name;
      dSources[i].url = url;
      dSources[i].columns = cols;
    }
  }
  await App.findOneAndUpdate({ _id: appId }, { dataSources: dSources });
  await DataSource.findOneAndUpdate(
    { _id: dsId },
    { name: name, url: url, columns: cols }
  );
  for (var i = 0; i < cols.length; i++) {
    await Column.findOneAndUpdate(
      { _id: cols[i]._id },
      {
        colLetter: cols[i].colLetter,
        initialValue: cols[i].initialValue,
        label: cols[i].label,
        reference: cols[i].reference,
        type: cols[i].type,
      }
    );
  }
  var tViews = app.tViews;
  for (var i = 0; i < tViews.length; i++) {
    if (tViews[i].view.dsurl === thisDS.url) {
      tViews[i].view.allColumns = cols;
      await TView.findOneAndUpdate(
        { _id: tViews[i]._id },
        { view: tViews[i].view }
      );
    }
  }
  await App.findOneAndUpdate({ _id: appId }, { tViews: tViews });
  res.send("Edited Data Source");
});

app.post("/getDataSources", async (req, res) => {
  const appId = req.body.appId;
  const app = await App.findOne({ _id: appId });
  const dsources = app.dataSources;
  res.send(dsources);
});

app.post("/getDetailRecord", async (req, res) => {
  const { index, appId, tableView, records, dView } = req.body;
  if (dView.view === undefined) res.send({ heading: [], row: [] });
  else {
    var colNames = [];
    for (let col of dView.view.columns) {
      colNames.push(col.name);
    }
    var heading = [];
    var row = [];
    for (var i = 0; i < records[0].length; i++) {
      if (colNames.includes(records[0][i])) {
        heading.push(records[0][i]);
        row.push(records[index][i]);
      }
    }
    res.send({
      heading: heading,
      row: row,
    });
  }

  // const sheets = google.sheets({ version: "v4", auth: client });

  // const currview = await TView.findOne({ _id: tableView });

  // const spreadsheetId = currview.view.dsurl.split("/")[5];
  // const gid = parseInt(currview.view.dsurl.split("gid=")[1]);

  // const { data } = await sheets.spreadsheets.get({
  //   spreadsheetId,
  //   includeGridData: true,
  // });

  // let title = "";
  // for (let d of data.sheets) {
  //   if (d.properties.sheetId == gid) {
  //     title = d.properties.title;
  //   }
  // }

  // const sheetdata = await sheets.spreadsheets.values.get({
  //   spreadsheetId,
  //   range: `'${title}'!A:Z`,
  //   majorDimension: "ROWS",
  //   valueRenderOption: "FORMATTED_VALUE",
  // });

  // console.log(sheetdata.data.values[0]);
  // console.log(sheetdata.data.values[index]);
  // console.log("aaaaaaaaaaaaaaaaaaa");
  // console.log(records[0][0]);
  // console.log(records[index]);

  // res.send({
  //   heading: records[0],
  //   row: records[index],
  // });
});

app.post("/getDisplayColumns", async (req, res) => {
  // Now just share with teamcaffein03
  const sessionid = req.session.id;
  const currUser = await User.findOne({ sessionid });
  const currentUserToken = currUser.refreshToken;
  const s2aOwnerEmail = "teamcaffeine03@gmail.com";
  const s2aOwnerUser = await User.findOne({ email: s2aOwnerEmail });
  const ownerToken = s2aOwnerUser.refreshToken;
  client.setCredentials({ refresh_token: ownerToken });

  // const client2 = new OAuth2Client(
  //   "475033388248-6sa0d0q32qh2mg9kuvk729tbe5lu22lq.apps.googleusercontent.com",
  //   "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",
  //   "http://localhost:3000"
  // );
  // client2.setCredentials({ refresh_token: currUser.refreshToken });
  // console.log("Current User: ", currUser.email);

  const sheets = google.sheets({ version: "v4", auth: client });

  const { appId, tableView } = req.body;

  const currview = await TView.findOne({ _id: tableView });
  dsurl = currview.view.dsurl;
  const spreadsheetId = dsurl.split("/")[5];
  const gid = parseInt(dsurl.split("gid=")[1]);

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

  let colNames = [];
  for (let col of currview.view.columns) {
    colNames.push(col.name);
  }
  const sheetdata = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${title}'!A:Z`,
    majorDimension: "COLUMNS",
    valueRenderOption: "FORMATTED_VALUE",
  });
  var allCols = sheetdata.data.values[0].map((_, colIndex) =>
    sheetdata.data.values.map((row) => row[colIndex])
  );
  // console.log(allCols);
  var temp = [];
  var filter = [];
  var userFilter = [];
  for (var i = 0; i < sheetdata.data.values.length; i++) {
    if (colNames.includes(sheetdata.data.values[i][0])) {
      temp.push(sheetdata.data.values[i]);
    }
    if (sheetdata.data.values[i][0] === currview.filter.name) {
      filter = sheetdata.data.values[i];
    }
    if (sheetdata.data.values[i][0] === currview.userFilter.name) {
      userFilter = sheetdata.data.values[i];
    }
  }
  var dataValues = [];
  var allCols2 = [];
  if (temp.length != 0) {
    dataValues = temp[0].map((_, colIndex) => temp.map((row) => row[colIndex]));
    allCols2 = allCols;
    // Check filter and userFilter
    if (filter.length > 0 && userFilter.length > 0) {
      var temp2 = [dataValues[0]];
      var temp3 = [allCols[0]];
      for (var i = 1; i < dataValues.length; i++) {
        if (filter[i] === "TRUE" && userFilter[i] === currUser.email) {
          temp2.push(dataValues[i]);
          temp3.push(allCols[i]);
        }
      }
      dataValues = temp2;
      allCols2 = temp3;
    } else if (filter.length > 0) {
      var temp2 = [dataValues[0]];
      var temp3 = [allCols[0]];
      for (var i = 1; i < dataValues.length; i++) {
        if (filter[i] === "TRUE") {
          temp2.push(dataValues[i]);
          temp3.push(allCols[i]);
        }
      }
      dataValues = temp2;
      allCols2 = temp3;
    } else if (userFilter.length > 0) {
      var temp2 = [dataValues[0]];
      var temp3 = [allCols[0]];
      for (var i = 1; i < dataValues.length; i++) {
        if (userFilter[i] === currUser.email) {
          temp2.push(dataValues[i]);
          temp3.push(allCols[i]);
        }
      }
      dataValues = temp2;
      allCols2 = temp3;
    }
  }
  client.setCredentials({ refresh_token: currentUserToken });
  // console.log(dataValues);
  res.send({ allCols: allCols2, dataValues: dataValues });
});

app.post("/addRecord", async (req, res) => {
  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });
  let email = userSessionid.email;

  const s2aOwnerEmail = "teamcaffeine03@gmail.com";
  // const currentToken = await client.getAccessToken();
  const currentUserToken = userSessionid.refreshToken;
  const s2aOwnerUser = await User.findOne({ email: s2aOwnerEmail });

  const ownerToken = s2aOwnerUser.refreshToken;
  client.setCredentials({ refresh_token: ownerToken });  

  const sheets = google.sheets({ version: "v4", auth: client });
  const { appId, tableView, newRow, addRecordCols } = req.body;

  const currview = await TView.findOne({ _id: tableView });
  const currDS = await DataSource.findOne({ url : currview.view.dsurl });
  const spreadsheetId = currview.view.dsurl.split("/")[5];
  const gid = parseInt(currview.view.dsurl.split("gid=")[1]);

  const { data } = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: true,
  });

  let sheetTitle = "";
  for (let d of data.sheets) {
    if (d.properties.sheetId == gid) {
      sheetTitle = d.properties.title;
    }
  }

  let newNewRow = [];
  var j = 0;
  for(var i=0; i<currDS.columns.length; i++) {
    console.log(currDS.columns[i].name);
    if(currDS.columns[i].name === addRecordCols[0][j]) {
      if(newRow[j] === null || newRow[j] === "") newNewRow.push(currDS.columns[i].initialValue);
      else newNewRow.push(newRow[j]);
      j++;
    }
    else if(currview.filter.name === currDS.columns[i].name) {
      newNewRow.push('TRUE');
    }
    else if(currview.userFilter.name === currDS.columns[i].name) {
      newNewRow.push(email);
    }
    else {
      newNewRow.push(currDS.columns[i].initialValue);
    }
  }

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [newNewRow],
      },
    });
    client.setCredentials({ refresh_token: currentUserToken });
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error adding record");
  }
});

function arraysEqual(a, b) {
  // Check if the arrays are the same length
  if (a.length !== b.length) {
    return false;
  }

  // Check each element of the arrays
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  // The arrays are equal
  return true;
}
app.post("/editRecord", async (req, res) => {
  const sessionid = req.session.id;
  const userSessionid = await User.findOne({ sessionid });
  const email = userSessionid.email;

  const s2aOwnerEmail = "teamcaffeine03@gmail.com";
  // const currentToken = await client.getAccessToken();
  const currentUserToken = userSessionid.refreshToken;
  const s2aOwnerUser = await User.findOne({ email: s2aOwnerEmail });

  const ownerToken = s2aOwnerUser.refreshToken;
  client.setCredentials({ refresh_token: ownerToken });  

  const sheets = google.sheets({ version: "v4", auth: client });
  const { appId, tableView, updatedRow, recordIndex, title, records } = req.body;
  
  let itemToEdit = records[recordIndex];
  const currview = await TView.findOne({ _id: tableView });
  const spreadsheetId = currview.view.dsurl.split("/")[5];
  const gid = parseInt(currview.view.dsurl.split("gid=")[1]);

  const { data } = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: true,
  });

  let sheetTitle = "";
  for (let d of data.sheets) {
    if (d.properties.sheetId == gid) {
      sheetTitle = d.properties.title;
    }
  }

  const sheetdata = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetTitle}'!A:Z`,
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE",
  });

  console.log("updated row:", updatedRow);
  console.log("recordIndex:", recordIndex);

  let indexToEdit;
  for (let i = 0; i < sheetdata.data.values.length; i++) {
    let result = arraysEqual(itemToEdit, sheetdata.data.values[i]);
    if (result) {
      indexToEdit = i;
      break;
    }
  }

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${sheetTitle}'!A${indexToEdit + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [updatedRow],
      },
    });
    // Set the credentials back to the current user's token
    client.setCredentials({ refresh_token: currentUserToken });

    res.send(response.data);
  } catch (error) {
    console.log("edit record error:", error);
  }
});

app.post("/deleteRecord", async (req, res) => {
  let { records, rowIndex, tableView, appId } = req.body;
  let itemToDelete = records[rowIndex];
  records.splice(rowIndex, 1);

  const sheets = google.sheets({ version: "v4", auth: client });

  const currview = await TView.findOne({ _id: tableView });

  if (!currview) {
    res.status(400).send("currview not found");
    return;
  }

  const spreadsheetId = currview.view.dsurl.split("/")[5];
  const gid = parseInt(currview.view.dsurl.split("gid=")[1]);

  const { data } = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: true,
  });

  let sheetTitle = "";
  for (let d of data.sheets) {
    if (d.properties.sheetId == gid) {
      sheetTitle = d.properties.title;
    }
  }
  // // console.log("SheetId: ", gid);
  // // console.log("RowIndex: " + rowIndex);

  const sheetdata = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetTitle}'!A:Z`,
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE",
  });

  let indexToDelete;
  for (let i = 0; i < sheetdata.data.values.length; i++) {
    let result = arraysEqual(itemToDelete, sheetdata.data.values[i]);
    if (result) {
      indexToDelete = i;
      break;
    }
  }

  try {
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: gid,
                dimension: "ROWS",
                startIndex: indexToDelete,
                endIndex: indexToDelete + 1,
              },
            },
          },
        ],
      },
    });
    res.send(records);
  } catch (error) {
    console.log(error);
  }
});

app.post("/isGlobalDeveloper", async (req, res) => {
  const { email } = req.body;
  const s2aOwnerEmail = "teamcaffeine03@gmail.com";
  if (email == s2aOwnerEmail) {
    res.send(true);
  } else {
    const currentToken = await client.getAccessToken();
    const currentUserToken = currentToken.res.data.refresh_token;

    const s2aOwnerUser = await User.findOne({ email: s2aOwnerEmail });
    const ownerToken = s2aOwnerUser.refreshToken;
    client.setCredentials({ refresh_token: ownerToken });

    const sheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = globalDeveloper.split("/")[5];
    const gid = parseInt(globalDeveloper.split("gid=")[1]);
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
    let isDev = false;
    const developers = sheetdata.data.values[0];
    for (let i = 1; i < developers.length; i++) {
      if (email == developers[i]) {
        isDev = true;
      }
    }

    client.setCredentials({ refresh_token: currentUserToken });

    res.send(isDev);
  }
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
