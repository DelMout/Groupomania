const express = require("express");
const router = express.Router();

const commCtrl = require("../controllers/comment");
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a comment
router.post("/:pubid/comm/:userid/", auth, commCtrl.createComm);

// * See all comments for a publication
router.get("/:pubid/comm/", commCtrl.getAllComm);

// * Search comments
router.get("/search/comment/:word", admin, commCtrl.searchComm);

// * Delete a comment
router.delete("/delete/comment/:comid", admin, commCtrl.deleteComm);

module.exports = router;
