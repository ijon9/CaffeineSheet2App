// get mongoose library
const mongoose = require("mongoose");

const columnSchema = mongoose.Schema({
  colLetter: String,
  name: String,
  initialValue: Object,
  label: Boolean,
  // May have to change this
  reference: String
});

// export this model
module.exports = mongoose.model("Column", columnSchema);

const viewSchema = mongoose.Schema({
  name: String,
  table: String,
  columns: [columnSchema],
  viewType: String,
  // 0: add record, 1: edit record, 2: delete record
  allowedActions: [Boolean],
  roles: [String]
});

const dViewSchema = mongoose.Schema({
    view: viewSchema,
    editFilter: [Boolean],
    editableColumns: [String]
});

const tViewSchema = mongoose.Schema({
    view: viewSchema,
    filter: [Boolean],
    userFilter: [String]
});

const dataSourceSchema = mongoose.Schema({
    name: String,
    url: String,
    sheetIndex: Number,
    key: [Number],
    columns: [columnSchema]
});

const appSchema = mongoose.Schema({
    name: String,
    creator: String,
    dataSources: [dataSourceSchema],
    dViews: [dViewSchema],
    tViews: [tViewSchema]
});


// export this model
module.exports = mongoose.model("View", viewSchema);
