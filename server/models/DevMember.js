const mongoose = require("mongoose");

const devMemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
}, { timestamps: true });

module.exports = mongoose.model("DevMember", devMemberSchema);