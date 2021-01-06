const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

// * Voir tous users
// router.get('/user',userCtrl.getAllUser);

// * Sign Up
router.post("/signup", userCtrl.signup);
// router.post("/signup", userCtrl.signup);

// * Login
router.post("/login", userCtrl.login);

// * Modify user datas
router.put("/modif", userCtrl.modif);

module.exports = router;
