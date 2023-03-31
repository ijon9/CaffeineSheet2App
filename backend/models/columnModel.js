// get mongoose library
const mongoose = require("mongoose");

const columnSchema = mongoose.Schema({
  colLetter: String,
  name: String,
  initialValue: mongoose.Schema.Types.Mixed,
  label: Boolean,
  // May have to change this
  reference: String,
  type: String,
  key: Boolean,
});

// export this model
module.exports = mongoose.model("Column", columnSchema);
