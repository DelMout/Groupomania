const express = require("express");
const router = express.Router();

const commCtrl = require("../controllers/comment");
const auth = require("../middleware/auth"); // Request authentification

// * Create a comment
router.post("/:pubid/comm/:userid/", auth, commCtrl.createComm);

// * See all comments for a publication
router.get("/:pubid/comm/", commCtrl.getAllComm);

// * Search comments
router.get("/search/comment/:word", commCtrl.searchComm); //! rajouter sécu Admin

// * Delete a comment
router.delete("/delete/comment/:comid", commCtrl.deleteComm); //! rajouter sécu Admin

module.exports = router;
