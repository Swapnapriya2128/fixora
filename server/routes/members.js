const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// Add member
router.post("/", async (req, res) => {
  const member = await Member.create(req.body);
  res.json(member);
});

// Get all members
router.get("/", async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

// Delete member
router.delete("/:id", async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;