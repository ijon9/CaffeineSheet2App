// get mongoose library
const mongoose = require("mongoose");
const View = require("./viewModel")
const Column = require("./columnModel")

const dViewSchema = mongoose.Schema({
    view: View.schema,
    editFilter: String,
    editableColumns: [String],
    tView : String
});

// export this model
module.exports = mongoose.model("DView", dViewSchema);