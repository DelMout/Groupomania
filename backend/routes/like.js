const express = require("express");
const router = express.Router();

const likeCtrl = require("../controllers/like");

const auth = require("../middleware/auth"); // Request authentification

// * Add a like
router.post("/:pubid/like/:userid", auth, likeCtrl.addLike);

// * Count likes
router.get("/:pubid/like/", likeCtrl.countLike);

module.exports = router;
