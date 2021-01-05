const { Sequelize } = require(".");

module.exports=(sequelize,DataTypes)=>{
    const like=sequelize.define("like",{
    },{
        timestamps:false,
    },{
        indexes:[
            {
                fields:['pub_id']       // ! Ne fonctionne pas !
            }
        ]
    });
    return like;
    };
    