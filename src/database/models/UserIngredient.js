import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./User.js";
import { Ingredient } from "./Ingredient.js";

const UserIngredient = sequelize.define(
	"UserIngredient",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			primaryKey: true,
		},
		ingredientId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Ingredient,
				key: "id",
			},
			primaryKey: true,
		},
		storage: {
			type: DataTypes.ENUM(["Fridge", "Freezer", "Pantry"]),
			allowNull: false,
		},
		unit: {
			type: DataTypes.ENUM(["pc", "g", "ml"]),
			allowNull: false,
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: "UserIngredients",
	},
);

export { UserIngredient };