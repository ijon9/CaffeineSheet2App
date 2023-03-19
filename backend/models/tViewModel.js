// get mongoose library
const mongoose = require("mongoose");
const View = require("./viewModel")

const tViewSchema = mongoose.Schema({
    view: View.schema,
    filter: [Boolean],
    userFilter: [String]
});

// export this model
module.exports = mongoose.model("TView", tViewSchema);