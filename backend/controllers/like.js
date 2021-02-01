const { like } = require("../models");

// * Add a like
exports.addLike = (req, res) => {
	// check if user not already liked
	like.findOne({ where: { publicationId: req.params.pubid, userId: req.params.userid } })
		.then((resp) => {
			if (resp === null) {
				const likes = new like({
					userId: req.params.userid,
					publicationId: req.params.pubid,
				});
				likes
					.save()
					.then((like) => {
						res.send(like);
					})
					.catch((err) => {
						res.send(err);
					});
			} else {
				like.destroy({
					where: { publicationId: req.params.pubid, userId: req.params.userid },
				})
					.then(() => res.send("like deleted"))
					.catch((err) => res.send(err));
			}
		})
		.catch((err) => {
			res.send(err);
		});
};
// * Count likes for a publication
exports.countLike = (req, res) => {
	like.findAll({ where: { publicationId: req.params.pubid } })
		.then((likes) => {
			res.send(likes);
		})
		.catch((err) => {
			res.send(err);
		});
};
