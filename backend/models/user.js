const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		"user",
		{
			nom: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					is: ["^[a-zÀ-ÿ- ']+$", "i"],
				},
			},
			prenom: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					is: ["^[a-zÀ-ÿ-]+$", "i"],
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
					notEmpty: true,
				},
			},
			service: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					is: ["^[0-9a-zA-ZÀ-ÿ- ']+$", "i"],
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			last_connect: {
				type: DataTypes.DATEONLY,
				defaultValue: DataTypes.NOW,
				allowNull: false,
			},
			photo: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			isAdmin: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			timestamps: false,
		}
	);
	return user;
};
