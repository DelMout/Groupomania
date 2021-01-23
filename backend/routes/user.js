const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification

// * Voir tous users
// router.get('/user',userCtrl.getAllUser);

// * Sign Up
router.post("/signup", multer, userCtrl.signup);

// * Login
router.post("/login", userCtrl.login);

// * Demand Modify user datas
router.get("/modif/:userid", auth, userCtrl.demandmodif);

// * Modify user datas
router.put("/modif/:userid", auth, multer, userCtrl.modif);

// * Delete user
router.delete("/delete/:userid", auth, multer, userCtrl.delete);

// * Identify user
router.get("/ident/:userid", userCtrl.ident);

module.exports = router;
