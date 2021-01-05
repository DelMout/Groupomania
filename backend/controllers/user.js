
const { user } = require('../models');

// * Get all users
exports.getAllUser=(req,res)=>{
    user.findAll()
    .then((users)=>{
        res.send(users);
    })
    .catch((err)=>{
        console.log(err);
    });
};


exports.signup=(req,res)=>{
    console.log(req.body);
    let nom=req.body.nom;      // TODO : Aller chercher les saisies
    let prenom=req.body.prenom;
    let email=req.body.email;
    let password=req.body.password;
    let service=req.body.service;
    let description=req.body.description
    // let nom="Baba";      // TODO : Aller chercher les saisies
    // let prenom="Joe";
    // let email="Bjoe@groupomania.fr";
    // let password="jjj";
    // let service="RH";
    // let description="tout me plait !"
    const newUser=new user({
        nom:nom,       // TODO : Aller chercher les saisies
        prenom:prenom,
        email:email,
        password:password,
        service:service,
        description:description
    });
    newUser.save()
    .then(()=>{
        res.send('user created');
    })
    .catch((err)=>{
        res.send(err);
    });
};

// * Login
// TODO : LOGIN à compléter
exports.login=(req,res)=>{
const email_saisi="louis@email.fr"; // TODO : Aller chercher les saisies
const password_saisi='llk';
    user.findOne({attributes:['password']},{ where:{ email:email_saisi }})
.then((objPassword)=>{
    if (objPassword.password===password_saisi){
        console.log('OK pour le password');
        res.send('password OK = '+objPassword.password);
    }else{
        console.log('c pas bon !!');
        res.send('password not good = '+objPassword.password);
};
})
.catch((err)=>{
    console.log(err);
});
};

// * Modify
exports.modif=(req,res)=>{
   const attIn='Standard';                      // TODO : Autoriser à modifier tous paramètres SAUF email !
    user.update({service:attIn},{where:{id:4}}) // TODO : Id de la personne qui modifie
    .then(()=>{
        res.send('user modified !');
    })
    .catch((err)=>{
        console.log(err);
    });
};