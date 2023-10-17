import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Embedding = sequelize.define(
	"Embedding",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		embedding: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "Embeddings",
	},
);

export { Embedding };