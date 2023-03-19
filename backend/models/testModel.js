// get mongoose library
const mongoose = require("mongoose");

// example schema that needs a user of type string and age of type number
const testSchema = mongoose.Schema({ user: String, age: Number });

// export this model
module.exports = mongoose.model("Test", testSchema);
