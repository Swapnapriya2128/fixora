const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema(
  {
    bugId: String,

    title: String,

    tcId: String,

    description: String,

    module: String,

    reporter: String,

    assignee: String,

    severity: String,

    status: { type: String, default: "Open" },

    // manual or automation
    bugType: {
      type: String,
      enum: ['manual', 'automation'],
      default: 'manual'
    },

    // automation fields
    logs: String,

    screenshot: String,

    project: String,

    buildNumber: String


  },
  { timestamps: true }
);

module.exports = mongoose.model("Bug", bugSchema);