const { Sequelize } = require(".");

module.exports=(sequelize,DataTypes)=>{
    const pub=sequelize.define("publication",{
        titre:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        texte_pub:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        photo:{
            type:DataTypes.STRING,
            allowNull:true,
        },
    },{
        timestamps:true,
        updatedAt:false,
        createdAt:'date_crea_pub',
        defaultValue:DataTypes.NOW
    });
    return pub;
    };
    