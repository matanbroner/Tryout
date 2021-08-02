const express = require("express");
const router = express.Router({ mergeParams: true });
const Tryout = require("../db/models/tryout");
const starterFiles = require("../db/assets/starterFiles");
const roles = require("../db/assets/roles");

const { ApiError } = require("./errors");
const { authMiddleware, adminMiddleware } = require("./middleware");
const { generateUuid } = require("../util");
const { TryoutFileDb } = require("../db");

// verify user is granted access to a tryout and return granted role
const validateTryoutAcess = (req, tryout) => {
  if (tryout.creatorId.toString() !== req.user._id.toString()) {
    // check if the user is an admin or is granted access to the tryout
    const sharedUser = tryout.sharedUsers.find(
      (user) => user.userId.toString() === req.user._id.toString()
    );
    if (sharedUser) {
      return sharedUser.role;
    } else if (req.user.role === roles.ADMIN) {
      return roles.ADMIN;
    } else {
      return null;
    }
  } else {
    return roles.OWNER;
  }
};

// fetch all tryouts for a user
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

// fetch all tryouts (admin only)
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tryouts = await Tryout.find({}).exec();
    res.status(200).json({ data: tryouts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// fetch tryout by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const tryout = await Tryout.findById(req.params.id).exec();
    if (!tryout) {
      throw new ApiError("Invalid tryout ID", 404);
    }
    // verify that the tryout belongs to the user
    const role = validateTryoutAcess(req, tryout);
    if (role === null) {
      throw new ApiError("Unauthorized", 403);
    } else {
      return res.status(200).json({ data: tryout, role });
    }
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
