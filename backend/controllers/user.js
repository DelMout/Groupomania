const { user } = require("../models");

// * Get all users
// exports.getAllUser = (req, res) => {
// 	const { emailC } = req.body;
// 	user.findAll({
// 		attributes: ["id"],
// 		where: { email: "clovis@groupomania.fr" },
// 	}).then((obj) => {
// 		res.send(obj[0]); //!renvoie {"id":32}
// 	});
// };

// * Create a new user
exports.signup = (req, res) => {
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
	} else {
		req.body.photo = null;
	}
	const newUser = new user({
		...req.body,
	});
	newUser
		.save()
		.then(() => {
			user.findAll({ where: { email: req.body.email } })
				.then((objUser) => {
					const obj = objUser[0];
					res.send(obj);
				})
				.catch((err) => {
					res.send(err);
				});
		})
		.catch((err) => {
			if (err.errors[0].validatorKey == "notEmpty") {
				res.status(401).send(err.errors[0]);
			} else if (err.name == "SequelizeUniqueConstraintError") {
				res.status(401).send("email already used");
			} else if (err.name == "SequelizeValidationError") {
				if (err.errors[0].path == "email") {
					res.status(401).send("Not format email");
					// TODO : erreur qd password pas assez fort, qd email erroné, qd manque une entrée.
				} else if (err.errors[0].validatorKey == "notEmpty") {
					res.status(401).send(err.errors[0]);
				}
			} else {
				res.status(401).send(err);
			}
		});
};

// * Login
exports.login = (req, res) => {
	const email_saisi = req.body.email;
	const password_saisi = req.body.password;
	user.findAll({ where: { email: email_saisi } })
		.then((rep) => {
			const obj = rep[0];
			const pass = obj.password;
			if (pass === password_saisi) {
				console.log("OK pour tout" + obj);
				res.send(obj);
			} else {
				console.log("c pas bon !!");
				res.send("Password not OK");
			}
		})
		.catch((err) => {
			console.log(err);
			res.send("Email not OK");
		});
};

// * Demand modify (click button)
exports.demandmodif = (req, res) => {
	const userId = req.params.id;
	user.findAll({ where: { id: userId } })
		.then((rep) => {
			const obj = rep[0];
			res.send(obj);
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
};

// * Modify
exports.modif = (req, res) => {
	user.update(
		{
			...req.body,
		},
		{ where: { id: req.params.id } }
	)
		.then(() => {
			res.send("user modified !");
		})
		.catch((err) => {
			console.log(err);
		});
};

// * Delete user
exports.delete = (req, res) => {
	user.destroy({ where: { id: req.params.id } })
		.then(() => {
			res.send("user deleted");
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
};

// * Identify user
exports.ident = (req, res) => {
	user.findAll({ where: { id: req.params.id } })
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
};
