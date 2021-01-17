const { like } = require("../models");

// * Add a like
exports.addLike = (req, res) => {
	// check if user not already liked
	like.findAll({ where: { publicationId: req.params.pubid, userId: req.params.userid } })
		.then((resp) => {
			if (resp[0] == null) {
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
						console.log(err);
					});
			} else {
				res.send("user already liked that publication");
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
