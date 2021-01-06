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

exports.signup = (req, res) => {
	let nom = req.body.nom; // TODO : Aller chercher les saisies
	let prenom = req.body.prenom;
	let email = req.body.email;
	let password = req.body.password;
	let service = req.body.service;
	let description = req.body.description;

	const newUser = new user({
		nom: nom,
		prenom: prenom,
		email: email,
		password: password,
		service: service,
		description: description,
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
			res.send(err);
		});
};

// * Login
// TODO : LOGIN à compléter
exports.login = (req, res) => {
	const email_saisi = req.body.email; // TODO : Aller chercher les saisies
	const password_saisi = req.body.password;
	// const email_saisi = "emi@groupomania.fr"; // TODO : Aller chercher les saisies
	// const password_saisi = "eee";
	user.findAll({ where: { email: email_saisi } })
		.then((obj) => {
			const pass = obj[0].password;
			if (pass === password_saisi) {
				console.log("OK pour tout");
				res.send("OK pour tout");
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

// * Modify
exports.modif = (req, res) => {
	const attIn = "Standard"; // TODO : Autoriser à modifier tous paramètres SAUF email !
	user.update({ service: attIn }, { where: { id: 4 } }) // TODO : Id de la personne qui modifie
		.then(() => {
			res.send("user modified !");
		})
		.catch((err) => {
			console.log(err);
		});
};
