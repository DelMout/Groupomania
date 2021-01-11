const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");
const pubRoutes = require("./routes/publication");
const commRoutes = require("./routes/comment");
const likeRoutes = require("./routes/like");

// Models
const { user } = require("./models");
const { publication } = require("./models");
const { comment } = require("./models");
const { like } = require("./models");

//association tables user/publication
publication.belongsTo(user);
module.exports = { user, publication };

//association tables user/comment et pub/comment
comment.belongsTo(user);
module.exports = { user, comment };
comment.belongsTo(publication);
module.exports = { publication, comment };

//association tables like/pub et like/user
like.belongsTo(user);
module.exports = { user, like };
like.belongsTo(publication);
module.exports = { publication, like };

app.use(cors()); // Security CORS
app.use(bodyParser.json());

// **** REQUETE ****

//  * User authentification
app.use("/api/auth", userRoutes);

// * Publications
app.use("/api/pub", pubRoutes);

// * Comments
app.use("/api/pub", commRoutes);

// * Likes
app.use("/api/pub", likeRoutes);

// app.get('/select',(req,res)=>{
//     user.findAll()
//     .then((users)=>{
//         res.send(users);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });
// });

app.get("/pub", (req, res) => {
	publication
		.findAll()
		.then((pubs) => {
			res.send(pubs);
		})
		.catch((err) => {
			console.log(err);
		});
});

// app.get('/select/lou',(req,res)=>{
//     user.findAll({ where:{ prenom:"Louise"}})
//     .then((users)=>{
//         res.send(users);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });

// });

// app.get('/insert',(req,res)=>{
//     user.create({
//         nom:"Lord",
//         prenom:"Manuel",
//     }).catch((err)=>{
//         if(err){
//             console.log(err);
//         }
//     });
//     res.send("insert");
// });

// app.get('/delete',(req,res)=>{
//     user.destroy({where:{id:10}});
//     res.send("delete");
// });

module.exports = app;
