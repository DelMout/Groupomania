const { publication } = require('../models');

// * Get all publications
// exports.getAllPub=(req,res)=>{
//     publication.findAll()
//     .then((pub)=>{
//         res.send(pub);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });
// };

// * Create a publication
exports.createPub=(req,res)=>{
    const pub=new publication({
        titre:'Essai !',            //TODO : Aller chercher les saisies
        texte_pub:"blablabla bla bla...",
        userId:2,   //TODO : Id de la personne connectée
    });
    pub.save()   
        .then((pub)=>{
            res.send(pub);
        })
        .catch((err)=>{
            console.log(err);
        });
};

// * Select a publication
exports.getPub=(req,res)=>{
    publication.findAll({ where:{ id:req.params.id }})
        .then((pub)=>{
            res.send(pub);
        })
        .catch((err)=>{
            console.log(err);
        });
};

// * Select publications by userId
exports.getPubByUser=(req,res)=>{
    publication.findAll({ where:{ userId:req.params.id }})
        .then((pub)=>{
            res.send(pub);
        })
        .catch((err)=>{
            console.log(err);
        });
};

// * Delete a publication
exports.deletePub=(req,res)=>{
    publication.findAll({ where:{ id:req.params.id }})
        .then((pub)=>{
            publication.destroy({where:{id:req.params.id}})
            .then(()=>res.send('publication deleted'))
            .catch((err)=>{
                console.log(err);
            });
        })
        .catch((err)=>{
            console.log(err);
        });
};