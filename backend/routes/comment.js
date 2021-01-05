const express = require('express');
const router = express.Router();

const commCtrl=require('../controllers/comment');


// * Create a comment
router.post('/',commCtrl.createComm);




module.exports=router;