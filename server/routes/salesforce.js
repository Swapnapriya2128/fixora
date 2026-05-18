const express = require("express");
const router = express.Router();
const Bug = require("../models/Bug");

router.post("/webhook", async (req, res) => {
  console.log("HEADERS:", req.headers);
  console.log("BODY FROM SF:", req.body);

  const { Id, Subject, Description } = req.body;

  if (!Id) {
    return res.status(400).send("No data from Salesforce");
  }

  const bug = await Bug.create({
    bugId: "SF-" + Id,
    title: Subject,
    description: Description,
    module: "Salesforce",
    reporter: "Salesforce",
    assignee: "Unassigned",
    severity: "Medium",
    status: "OPEN",
  });

  console.log("Saved to Mongo:", bug);
  res.send("Saved");
});

module.exports = router;