import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Recipe = sequelize.define(
	"Recipe",
	{
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		ingredients: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		directions: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		NER: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "Recipes",
	},
);

export { Recipe };