const { like } = require('../models');


// * Add a like
exports.addLike=(req,res)=>{
    const likes=new like({
        userId:4,       // TODO : Id de la personne qui like
        publicationId:1,    // TODO : Id de la publication = id dans URL
    });
    likes.save()   
        // .then((like)=>{
        //     res.send(like);
        // })
        // .catch((err)=>{
        //     console.log(err);
        // });
    like.findAndCountAll({      // ! Prob sync car ne prend  pas en compte le dernier rajout
        where:{
            publicationId:1
        }
    })
    .then(total=>{
        res.send("total likes = "+total.count);
    });
};