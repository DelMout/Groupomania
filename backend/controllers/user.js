
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
    const newUser=new user({
        nom:'Dutrou',       // TODO : Aller chercher les saisies
        prenom:'Harold',
        email:'haha@email.fr',
        password:'hhh',
        service:'Maintenance',
        description:'Parachutime !'
    });
    newUser.save()
    .then(()=>{
        res.send('user created');
    })
    .catch((err)=>{
        console.log(err);
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