const express = require('express');
const router = express.Router();

const likeCtrl=require('../controllers/like');


// * Add a like
router.post('/',likeCtrl.addLike);

module.exports=router;


// derniere modif !