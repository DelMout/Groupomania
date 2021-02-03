const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		const userId = decodedToken.userId;
		const isAdmin = decodedToken.isAdmin;

		if (isAdmin === 0) {
			throw "Not Admin";
		} else {
			if (isAdmin === 1 && userId !== parseInt(process.env.ID_ADMIN)) {
				throw "Invalid user admin";
			} else {
				next();
			}
		}
	} catch (error) {
		res.status(401).send(error);
	}
};
