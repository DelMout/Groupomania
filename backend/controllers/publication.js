const { publication } = require("../models");

// * Get all publications
exports.getAllPub = (req, res) => {
	publication
		.findAll({
			order: [["date_crea_pub", "DESC"]],
		})
		.then((pub) => {
			res.send(pub);
		})
		.catch((err) => {
			console.log(err);
		});
};

// * Create a publication
exports.createPub = (req, res) => {
	const newPub = new publication({
		titre: req.body.titre,
		texte_pub: req.body.contenu,
		userId: req.params.id,
	});
	newPub
		.save()
		.then((pub) => {
			res.send(pub);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Select a publication
exports.getPub = (req, res) => {
	publication
		.findAll({ where: { id: req.params.id } })
		.then((pub) => {
			res.send(pub);
		})
		.catch((err) => {
			console.log(err);
		});
};

// * Select publications by userId
exports.getPubByUser = (req, res) => {
	publication
		.findAll({ where: { userId: req.params.id } })
		.then((pub) => {
			res.send(pub);
		})
		.catch((err) => {
			console.log(err);
		});
};

// * Delete a publication
exports.deletePub = (req, res) => {
	publication
		.findAll({ where: { id: req.params.id } })
		.then((pub) => {
			publication
				.destroy({ where: { id: req.params.id } })
				.then(() => res.send("publication deleted"))
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
};
