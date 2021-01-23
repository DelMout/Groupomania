const { publication } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	publication
		.findOne({ where: { id: req.params.pubid } })
		.then((pub) => {
			try {
				const token = req.headers.authorization.split(" ")[1];
				const decodedToken = jwt.verify(token, "un_long_chemin");
				const userConnectedId = decodedToken.userId;
				const userAuthorId = pub.userId;
				if (userConnectedId !== userAuthorId) {
					throw "Connected user is not the publication author.";
				} else {
					next();
				}
			} catch {
				res.status(401).send("Invalid request!");
			}
		})
		.catch((error) => res.status(400).send(error));
};
