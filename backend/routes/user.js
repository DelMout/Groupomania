const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification

// * Voir tous users
router.get("/users", userCtrl.getAllUsers);

// * Sign Up
router.post("/signup", multer, userCtrl.signup);

// * Login
router.post("/login", userCtrl.login);

// * Demand Modify user datas
router.get("/modif/:userid", auth, userCtrl.demandmodif);

// * Modify user datas
router.put("/modif/:userid", auth, multer, userCtrl.modif);

// * Delete user
router.delete("/delete/:userid", multer, userCtrl.delete); //! remettre auth ! + Rajouter droit admin

// * Identify user
router.get("/ident/:userid", userCtrl.ident);

// * Find user by email
router.get("/find/:email", userCtrl.findUser); //! Seulement pour Admin

module.exports = router;
