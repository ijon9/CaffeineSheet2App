// get mongoose library
const mongoose = require("mongoose");
const View = require("./viewModel")

const dViewSchema = mongoose.Schema({
    view: View.schema,
    editFilter: [Boolean],
    editableColumns: [String]
});

// export this model
module.exports = mongoose.model("DView", dViewSchema);