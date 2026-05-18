const express = require("express");
const router = express.Router();
const TestCase = require("../models/TestCase");

router.get("/", async (req, res) => {
  const data = await TestCase.find();
  res.json(data);
});

router.get("/:projectId", async (req, res) => {
  const data = await TestCase.find({ projectId: req.params.projectId });
  res.json(data);
});

// ✅ Add testcase
router.post("/", async (req, res) => {
  const count = await TestCase.countDocuments();
  const tcId = "TC-" + (1001 + count);

  const tc = new TestCase({ ...req.body, tcId });
  await tc.save();
  res.json(tc);
});

module.exports = router;