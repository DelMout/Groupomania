const { Sequelize } = require(".");

module.exports=(sequelize,DataTypes)=>{
    const com=sequelize.define("comment",{
        texte_com:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    },{
        timestamps:true,
        updatedAt:false,
        createdAt:'date_crea_com',
        defaultValue:DataTypes.NOW
    });
    return com;
    };
    