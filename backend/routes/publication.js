const express = require("express");
const router = express.Router();

const pubCtrl = require("../controllers/publication");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const ident = require("../middleware/ident"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a publication
router.post("/create/:userid", auth, multer, pubCtrl.createPub);

// * Select all publications
router.get("/", pubCtrl.getAllPub);

// * Select a publication
// router.get("/:pubid", pubCtrl.getPub); //! a supprimer

// * Select publications by userId
router.get("/user/:userid", auth, pubCtrl.getPubByUser);

// * Delete a publication
router.delete("/:pubid/:userid", auth, ident, multer, pubCtrl.deletePub); //! remttre auth et ident

// * Search word in publications
router.get("/search/:word", admin, pubCtrl.searchPub);

// * Login
// TODO Dégriser qd controllers/login sera OK
// router.post('/login',userCtrl.login);

module.exports = router;
