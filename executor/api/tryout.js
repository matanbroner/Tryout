const express = require("express");
const router = express.Router({ mergeParams: true });
const Tryout = require("../db/models/tryout");
const starterFiles = require("../db/assets/starterFiles");

const { ApiError } = require("./errors");
const { authMiddleware, adminMiddleware } = require("./middleware");
const { generateUuid } = require("../util");
const { TryoutFileDb } = require("../db");

// fetch all tryouts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tryouts = await Tryout.find({
      creatorId: req.user._id,
    }).exec();
    res.status(200).json({ data: tryouts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create a new tryout
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, language } = req.body;
    const creatorId = req.user._id;
    const tryoutId = generateUuid();

    const baseFile = starterFiles[language];
    if (typeof baseFile === "undefined") {
      throw new ApiError("Invalid language");
    }
    if (!TryoutFileDb.connected) {
      throw new ApiError("Tryout File DB is not connected", 500);
    }
    await TryoutFileDb.createDoc(tryoutId, baseFile);

    const tryout = new Tryout({
      name,
      tryoutId,
      language,
      creatorId,
      files: [baseFile],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await tryout.save();
    res.status(201).json({
      data: tryout,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.status).json({
        error: err.message,
      });
    } else {
      return res.status(500).json({
        error: err.message,
      });
    }
  }
});

module.exports = router;
