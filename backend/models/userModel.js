// get mongoose library
const mongoose = require("mongoose");

// User Schema model. Add more attributes later if needed
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  sessionid: String,
});

// export this model
module.exports = mongoose.model("User", userSchema);
