const { user } = require("../models");
const fs = require("fs"); // handle files
const bcrypt = require("bcrypt"); // crypt password
const jwt = require("jsonwebtoken"); // create token key

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
		password: bcrypt.hashSync(req.body.password, 10),
	});
	newUser
		.save()
		.then((user) => {
			let token = jwt.sign({ user: user }, "un_long_chemin", {
				expiresIn: "1h",
			});
			res.json({
				user: user,
				token: token,
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
		.then((user) => {
			const obj = user[0];
			const pass = obj.password;
			if (bcrypt.compareSync(password_saisi, pass)) {
				console.log("OK pour tout" + obj);
				let token = jwt.sign({ user: user }, "un_long_chemin", {
					expiresIn: "1h",
				});
				res.json({
					user: user,
					token: token,
				});
			} else {
				console.log("c pas bon !!");
				res.status(401).send("Password not OK");
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(401).send("Email not OK");
		});
};

// * Demand modify (click button)
exports.demandmodif = (req, res) => {
	const userId = req.params.userid;
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
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
		//delete the previous image file
		user.findAll({ where: { id: req.params.userid } })
			.then((rep) => {
				if (rep[0].photo != null) {
					const filename = rep[0].photo.split("/images/")[1];
					fs.unlink(`images/${filename}`, () => {
						user.update({ ...req.body }, { where: { id: req.params.userid } })
							.then(() => {
								console.log("user and image file modified");
								res.send("user and image file modified");
							})
							.catch((err) => {
								console.log(err);
								res.send(err);
							});
					});
				} else {
					user.update({ ...req.body }, { where: { id: req.params.userid } })
						.then(() => {
							console.log("user modified and image file saved");
							res.send("user modified and image file saved");
						})
						.catch((err) => {
							console.log(err);
							res.send(err);
						});
				}
			})
			.catch((err) => {
				res.status(401).send(err.errors[0].validatorKey);
			});
	} else {
		req.body.photo = null;
		user.update(
			{
				...req.body,
			},
			{ where: { id: req.params.userid } }
		)
			.then(() => {
				console.log("user modified !");
				res.send("user modified !");
			})
			.catch((err) => {
				res.status(401).send(err.errors[0].validatorKey);
			});
	}
};

// * Delete user
exports.delete = (req, res) => {
	user.findAll({ where: { id: req.params.userid } })
		.then((resp) => {
			if (resp[0].photo != null) {
				const filename = resp[0].photo.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					user.destroy({ where: { id: req.params.userid } })
						.then(() => {
							res.send("user and image file deleted");
						})
						.catch((err) => {
							console.log(err);
							res.send(err);
						});
				});
			} else {
				user.destroy({ where: { id: req.params.userid } })
					.then(() => {
						res.send("user deleted");
					})
					.catch((err) => {
						console.log(err);
						res.send(err);
					});
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

// * Identify user
exports.ident = (req, res) => {
	user.findAll({ where: { id: req.params.userid } })
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
};
