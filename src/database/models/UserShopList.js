import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const UserShopList = sequelize.define(
	"UserShopList",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ingredientName: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "UserShopLists",
	},
);

export { UserShopList };