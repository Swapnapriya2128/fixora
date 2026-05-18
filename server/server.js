const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const automationRoutes =
require("./routes/automationRoutes");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/bugtracker"
  )
  .then(() =>
    console.log("MongoDB Connected")
  );

app.use("/bugs", require("./routes/bugs"));
app.use(
  "/salesforce",
  require("./routes/salesforce")
);

app.use("/auth", require("./routes/auth"));

app.use(
  "/testcases",
  require("./routes/testcases")
);


app.use(
  "/api/devmembers",
  require("./routes/devteam")
);

app.use(
  "/api/automation",
  automationRoutes
);



console.log(
  path.join(__dirname, "uploads")
);
const fs = require("fs");

app.get("/check-file", (req, res) => {

  const filePath = path.join(
    __dirname,
    "uploads",
    "abc.png"
  );


  console.log(filePath);

  if (fs.existsSync(filePath)) {
    res.send("File Exists");
  } else {
    res.send("File Missing");
  }
});
app.listen(5000, () =>
  console.log("Running on 5000")
);