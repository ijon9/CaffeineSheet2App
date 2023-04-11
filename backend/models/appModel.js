// get mongoose library
const mongoose = require("mongoose");
const DataSource = require("./dataSourceModel");
const DView = require("./dViewModel");
const TView = require("./tViewModel");

const appSchema = mongoose.Schema({
  name: String,
  creator: String,
  dataSources: [DataSource.schema],
  dViews: [DView.schema],
  tViews: [TView.schema],
  roleSheet: String,
  published: Boolean,
});

// export this model
module.exports = mongoose.model("App", appSchema);
