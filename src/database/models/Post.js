import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./User.js";
import { Recipe } from "./Recipe.js";

const Post = sequelize.define(
	"Post",
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
		caption: {
			type: DataTypes.STRING(1024),
			allowNull: false,
		},
		category: {
			type: DataTypes.ENUM(["Breakfast", "Lunch", "Dinner", "All"]),
			allowNull: false,
		},
	},
	{
		tableName: "Posts",
	},
);

export { Post };