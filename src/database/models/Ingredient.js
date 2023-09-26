import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Ingredient = sequelize.define(
	"Ingredient",
	{
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "Ingredients",
	},
);

export { Ingredient };