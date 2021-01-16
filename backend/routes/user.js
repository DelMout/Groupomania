const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const multer = require("../middleware/multer-config"); //Upload files

// * Voir tous users
// router.get('/user',userCtrl.getAllUser);

// * Sign Up
router.post("/signup", multer, userCtrl.signup);

// * Login
router.post("/login", userCtrl.login);

// * Demand Modify user datas
router.get("/modif/:id", userCtrl.demandmodif);

// * Modify user datas
router.put("/modif/:id", userCtrl.modif);

// * Delete user
router.delete("/delete/:id", userCtrl.delete);

// * Identify user
router.get("/ident/:id", userCtrl.ident);

module.exports = router;
