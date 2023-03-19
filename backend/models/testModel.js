const mongoose = require("mongoose");

const testSchema = mongoose.Schema({ user: String });

module.exports = mongoose.model("Test", testSchema);
