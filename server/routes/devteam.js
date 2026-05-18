const express = require("express");
const router = express.Router();
const DevMember = require("../models/DevMember");

// ➕ Add Member
router.post("/", async (req, res) => {
  try {
    const member = new DevMember(req.body);
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get All Members
router.get("/", async (req, res) => {
  const members = await DevMember.find();
  res.json(members);
});

// ❌ Delete Member
router.delete("/:id", async (req, res) => {
  await DevMember.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;