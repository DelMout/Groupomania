const express = require("express");
const router = express.Router();

const commCtrl = require("../controllers/comment");
const auth = require("../middleware/auth"); // Request authentification

// * Create a comment
router.post("/:pubid/comm/:userid/", auth, commCtrl.createComm);

// * See all comments for a publication
router.get("/:pubid/comm/", commCtrl.getAllComm);

module.exports = router;
