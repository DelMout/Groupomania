const express = require("express");
const router = express.Router();

const likeCtrl = require("../controllers/like");

// * Add a like
router.post("/:pubid/like/:userid", likeCtrl.addLike);

// * Count likes
router.get("/:pubid/like/", likeCtrl.countLike);

module.exports = router;
