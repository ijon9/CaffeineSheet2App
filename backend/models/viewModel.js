// get mongoose library
const mongoose = require("mongoose");
const Column = require("./columnModel");

const viewSchema = mongoose.Schema({
  name: String,
  table: String,
  columns: [Column.schema],
  allColumns: [Column.schema],
  viewType: String,
  // 0: add record, 1: edit record, 2: delete record
  allowedActions: [Boolean],
  roles: [String],
  dsurl: String,
});

// export this model
module.exports = mongoose.model("View", viewSchema);
