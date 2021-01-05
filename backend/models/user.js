const { Sequelize } = require(".");

module.exports=(sequelize,DataTypes)=>{
const user=sequelize.define("user",{
    nom:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    prenom:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    service:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,        // ! à crypter !
    },
    last_connect:{
        type:DataTypes.DATEONLY,
        defaultValue:DataTypes.NOW,
        allowNull:false,
    },
    photo:{
        type:DataTypes.STRING,
        allowNull:true,
    },
},
{
   timestamps:false
},

);
return user;
};
