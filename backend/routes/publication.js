const express = require("express");
const router = express.Router();

const pubCtrl = require("../controllers/publication");

const multer = require("../middleware/multer-config"); //Upload files

// * Create a publication
router.post("/create/:userid", multer, pubCtrl.createPub);

// * Select all publications
router.get("/", pubCtrl.getAllPub);

// * Select a publication
router.get("/:pubid", pubCtrl.getPub);

// * Select publications by userId
router.get("/user/:userid", pubCtrl.getPubByUser);

// * Delete a publication
router.delete("/:pubid", multer, pubCtrl.deletePub);

// * Login
// TODO Dégriser qd controllers/login sera OK
// router.post('/login',userCtrl.login);

module.exports = router;
