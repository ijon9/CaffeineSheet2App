const mongoose = require("mongoose");

//function for our backend to connect to our mongodb database
const connectDB = async () => {
  try {
    // currently its on local database but planning to move this to an online version
    await mongoose.connect("mongodb://localhost:27017/app2sheetdb");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
