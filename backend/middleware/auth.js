const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "un_long_chemin");
		const userId = decodedToken.userId;
		const paramUserId = parseInt(req.params.userid);

		if (paramUserId && paramUserId !== userId) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch (error) {
		res.status(401).send(error);
	}
};
