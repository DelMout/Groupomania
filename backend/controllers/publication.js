const { fstat } = require("fs");
const { publication } = require("../models");
const fs = require("fs");

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
			res.status(401).send(err.errors[0].validatorKey);
		});
};

// * Select a publication
exports.getPub = (req, res) => {
	publication
		.findAll({ where: { id: req.params.pubid } })
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
		.findAll({
			order: [["date_crea_pub", "DESC"]],
			where: { userId: req.params.userid },
		})
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
		.findAll({ where: { id: req.params.pubid } })
		.then((pub) => {
			if (pub[0].photo != null) {
				const filename = pub[0].photo.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					publication
						.destroy({ where: { id: req.params.pubid } })
						.then(() => res.send("publication and image file deleted"))
						.catch((err) => {
							console.log(err);
						});
				});
			} else {
				publication
					.destroy({ where: { id: req.params.pubid } })
					.then(() => res.send("publication deleted"))
					.catch((err) => {
						console.log(err);
					});
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
