const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const like = sequelize.define(
		"like",
		{},
		{
			timestamps: false,
		}
	);
	return like;
};
