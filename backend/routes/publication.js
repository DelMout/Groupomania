const express = require("express");
const router = express.Router();

const pubCtrl = require("../controllers/publication");

// * Create a publication
router.post("/:id", pubCtrl.createPub);

// * Select a publication
router.get("/:id", pubCtrl.getPub);

// * Select publications by userId
router.get("/user/:id", pubCtrl.getPubByUser);

// * Delete a publication
router.delete("/:id", pubCtrl.deletePub);

// * Login
// TODO Dégriser qd controllers/login sera OK
// router.post('/login',userCtrl.login);

module.exports = router;
