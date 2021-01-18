const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "un_long_chemin");
		const userId = decodedToken.userId;
		if (!decodedToken) {
			// if (req.params.userid && req.params.userid !== userId) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch {
		res.status(401).send("Invalid request!");
	}
};
