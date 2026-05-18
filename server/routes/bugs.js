const express = require("express");
const router = express.Router();

const Bug = require("../models/Bug");

const multer = require("multer");
const path = require("path");


// STORAGE
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );

  },

});


// MULTER
const upload = multer({
  storage,
});


// GET ALL BUGS
router.get("/", async (req, res) => {

  const bugs = await Bug.find()
    .sort({ createdAt: -1 });

  res.json(bugs);

});


// CREATE BUG
router.post(
  "/",
  upload.single("screenshot"),

  async (req, res) => {

    try {

      const count =
        await Bug.countDocuments();

      const bugId =
        "BUG-" + (1001 + count);

      const newBug = new Bug({

        bugId,

        project:
          req.body.project,

        title:
          req.body.title,

        description:
          req.body.description,

        module:
          req.body.module,

        severity:
          req.body.severity,

        reporter:
          req.body.reporter,

        assignee:
          req.body.assignee,

        status:
          req.body.status,

        tcId:
          req.body.tcId,

        screenshot:
          req.file?.filename || "",

      });

      await newBug.save();

      res.json(newBug);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  }
);


// UPDATE BUG
router.put("/:id", async (req, res) => {

  try {

    const updated =
      await Bug.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updated);

  } catch (err) {

    res.status(500)
      .send(err.message);

  }

});


// DELETE BUG
router.delete("/:id", async (req, res) => {

  await Bug.findByIdAndDelete(
    req.params.id
  );

  res.send("Deleted");

});


module.exports = router;