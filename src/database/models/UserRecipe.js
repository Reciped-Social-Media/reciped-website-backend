import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./User.js";
import { Recipe } from "./Recipe.js";

const UserRecipe = sequelize.define(
	"UserRecipe",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		recipeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Recipe,
				key: "id",
			},
		},
		isPublic: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		category: {
			type: DataTypes.ENUM(["Breakfast", "Lunch", "Dinner", "All"]),
			allowNull: false,
		},
	},
	{
		tableName: "UserRecipes",
	},
);

export { UserRecipe };