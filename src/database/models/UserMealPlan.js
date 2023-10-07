import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./User.js";
import { Recipe } from "./Recipe.js";

const UserMealPlan = sequelize.define(
	"UserMealPlan",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		time: {
			type: DataTypes.ENUM(["Breakfast", "Lunch", "Dinner", "Dessert"]),
			allowNull: false,
		},
		recipeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Recipe,
				key: "id",
			},
		},
		source: {
			type: DataTypes.ENUM(["Cookbook", "Recommend"]),
			allowNull: false,
		},
	},
	{
		tableName: "UserMealPlans",
	},
);

export { UserMealPlan };