import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./User.js";

const Session = sequelize.define(
	"Session",
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		tableName: "Sessions",
	},
);

export { Session };