const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    projectId: String,
    tcId: String,
    description: String,
    steps: String,
    testData: String,
    expectedResult: String,
    actualResult: String,
    status: String, // PASS / FAIL
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestCase", testCaseSchema);