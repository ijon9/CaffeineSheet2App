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
