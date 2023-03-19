const Test = require("../models/testModel");

testGet = async (req, res) => {
  const tests = await Test.find();
  res.status(200).json(tests);
};
testPost = (req, res) => {
  console.log("horray");
};

module.exports = { testGet, testPost };
