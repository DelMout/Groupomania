const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const pub = sequelize.define(
		"publication",
		{
			titre: {
				type: DataTypes.STRING,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			texte_pub: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			photo: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: true,
			updatedAt: false,
			createdAt: "date_crea_pub",
			defaultValue: DataTypes.NOW,
		}
	);
	return pub;
};
