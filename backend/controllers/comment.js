const { comment } = require("../models");

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
