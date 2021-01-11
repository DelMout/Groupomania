const express = require("express");
const router = express.Router();

const commCtrl = require("../controllers/comment");

// * Create a comment
router.post("/:pubid/comm/:id/", commCtrl.createComm);

// * See all comments for a publication
router.get("/:pubid/comm/", commCtrl.getAllComm);

module.exports = router;
