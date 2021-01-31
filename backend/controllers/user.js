const { user } = require("../models");
const fs = require("fs"); // handle files
const bcrypt = require("bcrypt"); // crypt password
const jwt = require("jsonwebtoken"); // create token key
const passwordValidator = require("password-validator");
const schemaPassword = new passwordValidator();

//* Schema Password
schemaPassword.is().min(10).has().uppercase().has().lowercase().has().digits();
// .has()
// .not(/\$|=|'|\./); // Nonauthorized : =  '   $ .

// * Create a new user
exports.signup = (req, res) => {
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
	} else {
		req.body.photo = null;
	}
	if (!schemaPassword.validate(req.body.password)) {
		return res
			.status(401)
			.send(
				"password not enough strong, missing :" +
					schemaPassword.validate(req.body.password, { list: true })
			);
	} else {
		const newUser = new user({
			...req.body,
			password: bcrypt.hashSync(req.body.password, 10),
		});
		newUser
			.save()
			.then((user) => {
				let token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, "un_long_chemin", {
					expiresIn: "1h",
				});
				res.json({
					userId: user.id,
					token: token,
					isAdmin: user.isAdmin,
				});
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

// * Login
exports.login = (req, res) => {
	const email_saisi = req.body.email;
	const password_saisi = req.body.password;
	user.findOne({ where: { email: email_saisi } })
		.then((user) => {
			const password = user.password;
			if (bcrypt.compareSync(password_saisi, password)) {
				let token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, "un_long_chemin", {
					expiresIn: "1h",
				});
				res.json({
					userId: user.id,
					token: token,
					isAdmin: user.isAdmin,
				});
			} else {
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
	user.findOne({ where: { id: userId } })
		.then((rep) => {
			res.send(rep);
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
};

// * Modify
exports.modif = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send(schemaPassword.validate(req.body.password, { list: true }));
	} else {
		if (req.file) {
			req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
			//delete the previous image file
			user.findOne({ where: { id: req.params.userid } })
				.then((rep) => {
					if (rep.photo != null) {
						const filename = rep.photo.split("/images/")[1];
						fs.unlink(`images/${filename}`, () => {
							user.update(
								{ ...req.body, password: bcrypt.hashSync(req.body.password, 10) },
								{ where: { id: req.params.userid } }
							)
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
						user.update(
							{ ...req.body, password: bcrypt.hashSync(req.body.password, 10) },
							{ where: { id: req.params.userid } }
						)
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
					password: bcrypt.hashSync(req.body.password, 10),
				},
				{ where: { id: req.params.userid } }
			)
				.then(() => {
					console.log("user modified !");
					res.send("user modified !");
				})
				.catch((err) => {
					// res.status(401).send(err);
					res.status(401).send(err.errors[0].validatorKey);
				});
		}
	}
};

// * Delete user
exports.delete = (req, res) => {
	user.findOne({ where: { id: req.params.userid } })
		.then((resp) => {
			if (resp.photo != null) {
				const filename = resp.photo.split("/images/")[1];
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

// * Get all users
exports.getAllUsers = (req, res) => {
	user.findAll({
		order: [["last_connect", "ASC"]],
	}).then((obj) => {
		res.send(obj); //!renvoie {"id":32}
	});
};

// * Identify user
exports.ident = (req, res) => {
	user.findOne({ where: { id: req.params.userid } })
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
};

// * Find user by email
// exports.findUser = (req, res) => {
// 	const findUser = await user.findOne({ where: { email: req.params.email } });
// 	if(findUser){
// 		async user.findOne({ where: { email: req.params.email } })
// 		.then((resp) => {
// 			res.send(resp);
// 		})
// 		.catch((err) => {
// 			res.send(err);
// 		});
// 	}	else{
// 		res.statsus(404).send("no user found");
// 	}
// };
exports.findUser = (req, res) => {
	user.findOne({ where: { email: req.params.email } })
		.then((resp) => {
			if (resp.prenom) {
				res.status(200).send(resp);
			} else {
				res.status(404).send("no user with that email");
			}
		})
		.catch((err) => {
			res.status(404).send("no user with that email");
		});
};
