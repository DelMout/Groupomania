const { publication } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

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
			res.send(err);
		});
};

// * Create a publication
exports.createPub = (req, res) => {
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
	} else {
		req.body.photo = null;
	}
	const newPub = new publication({
		...req.body,
		userId: req.params.userid,
	});
	newPub
		.save()
		.then((pub) => {
			res.send(pub);
		})
		.catch((err) => {
			// res.send(err);
			res.status(401).send(err.errors[0].validatorKey);
		});
};

// * Select publications by userId
exports.getPubByUser = (req, res) => {
	publication
		.findAll({
			order: [["date_crea_pub", "DESC"]],
			where: { userId: req.params.userid },
		})
		.then((pub) => {
			res.send(pub);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Delete a publication
exports.deletePub = (req, res) => {
	publication
		.findOne({ where: { id: req.params.pubid } })
		.then((pub) => {
			if (pub.photo != null) {
				const filename = pub.photo.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					publication
						.destroy({ where: { id: req.params.pubid } })
						.then(() => res.send("publication and image file deleted"))
						.catch((err) => {
							res.send(err);
						});
				});
			} else {
				publication
					.destroy({ where: { id: req.params.pubid } })
					.then(() => res.send("publication deleted"))
					.catch((err) => {
						res.send(err);
					});
			}
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Search publications
exports.searchPub = (req, res) => {
	publication
		.findAll({
			where: {
				[Op.or]: [
					{ titre: { [Op.like]: "%" + req.params.word + "%" } },
					{ texte_pub: { [Op.like]: "%" + req.params.word + "%" } },
				],
			},
		})
		.then((pub) => {
			if (!pub[0]) {
				res.status(401).send("not found");
			}
			res.send(pub);
		})
		.catch((err) => {
			res.send(err);
		});
};
