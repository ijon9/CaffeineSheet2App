// get mongoose library
const mongoose = require("mongoose");
const Column = require("./columnModel")

const dataSourceSchema = mongoose.Schema({
    name: String,
    url: String,
    sheetIndex: Number,
    key: [Number],
    columns: [Column.schema]
});

// export this model
module.exports = mongoose.model("DataSource", dataSourceSchema);