import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { Recipe } from "./Recipe.js";

const RecipeIngredient = sequelize.define(
	"RecipeIngredient",
	{
		recipeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Recipe,
				key: "id",
			},
		},
		ingredientName: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "RecipeIngredients",
	},
);

export { RecipeIngredient };