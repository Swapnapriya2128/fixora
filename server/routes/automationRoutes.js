const express = require('express');
const router = express.Router();

const Bug = require('../models/Bug');

router.post('/report-failure', async (req, res) => {

  try {

    const bug = await Bug.create(req.body);

    res.status(201).json({
      success: true,
      bug
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

module.exports = router;