const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet"); // Protect HTTP headers

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
app.use(helmet());

// **** REQUETE ****

//  * User authentification
app.use("/api/auth", userRoutes);

// * Publications
app.use("/api/pub", pubRoutes);

// * Comments
app.use("/api/pub", commRoutes);

// * Likes
app.use("/api/pub", likeRoutes);

// * Access images
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;
