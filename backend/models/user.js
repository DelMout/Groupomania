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
				},
			},
			prenom: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
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
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false, // ! à crypter !
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
		},
		{
			timestamps: false,
		}
	);
	return user;
};
