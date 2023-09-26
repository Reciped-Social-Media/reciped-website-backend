import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { Session } from "./Session.js";

const SessionRefreshToken = sequelize.define(
	"SessionRefreshToken",
	{
		sessionId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Session,
				key: "uuid",
			},
		},
		refreshToken: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "SessionRefreshTokens",
	},
);

export { SessionRefreshToken };