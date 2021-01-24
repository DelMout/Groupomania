const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "un_long_chemin");
		const userId = decodedToken.userId;
		const isAdmin = decodedToken.isAdmin;
		console.log("is aDmin =" + isAdmin);
		const paramUserId = parseInt(req.params.userid);

		// if (isAdmin === 0) {
		// 	throw "Invalid user ID";
		// } else {
		// 	next();
		// }
		if (
			(isAdmin === 0 && paramUserId && paramUserId !== userId) ||
			(isAdmin === 1 && userId !== 68)
		) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch (error) {
		res.status(401).send(error);
	}
};
