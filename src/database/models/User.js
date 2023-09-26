import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const User = sequelize.define(
	"User",
	{
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		passwordHash: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "Users",
	},
);

export { User };