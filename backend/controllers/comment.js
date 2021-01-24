const { comment } = require("../models");
const { Op } = require("sequelize");

// * Create a comment
exports.createComm = (req, res) => {
	const newComm = new comment({
		texte_com: req.body.texte,
		userId: req.params.userid, // TODO : Id de la personne connectée
		publicationId: req.params.pubid, // TODO : Id de la publication = id dans URL
	});
	newComm
		.save()
		.then((rep) => {
			res.send(rep);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * See all comments for a publication
exports.getAllComm = (req, res) => {
	comment
		.findAll({ where: { publicationId: req.params.pubid } })
		.then((rep) => {
			res.send(rep);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Search comments
exports.searchComm = (req, res) => {
	comment
		.findAll({
			where: {
				texte_com: { [Op.like]: "%" + req.params.word + "%" },
			},
		})
		.then((com) => {
			if (!com[0]) {
				res.status(401).send("not found");
			}
			res.send(com);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Delete a comment
exports.deleteComm = (req, res) => {
	comment
		.findOne({ where: { id: req.params.comid } })
		.then((resp) => {
			if (resp === null) {
				res.status(401).send("comment not exist");
			} else {
				comment
					.destroy({ where: { id: req.params.comid } })
					.then(() => res.status(200).send("comment deleted"))
					.catch((err) => {
						console.log(err);
					});
			}
		})
		.catch((err) => {
			res.send(err);
		});
};
