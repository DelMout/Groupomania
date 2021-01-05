const { comment } = require('../models');


// * Create a comment
exports.createComm=(req,res)=>{
    const comm=new comment({
        texte_com:'essai ultime and again .. pour date auto? !!!',
        userId:4,       // TODO : Id de la personne connectée
        publicationId:1,    // TODO : Id de la publication = id dans URL
    });
    comm.save()   
        .then((com)=>{
            res.send(com);
        })
        .catch((err)=>{
            console.log(err);
        });
};