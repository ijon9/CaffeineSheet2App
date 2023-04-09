// get mongoose library
const mongoose = require("mongoose");
const View = require("./viewModel")
const Column = require("./columnModel")

const tViewSchema = mongoose.Schema({
    view: View.schema,
    filter: Column.schema,
    userFilter: Column.schema
});

// export this model
module.exports = mongoose.model("TView", tViewSchema);