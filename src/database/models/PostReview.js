import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./User.js";
import { Post } from "./Post.js";

const PostReview = sequelize.define(
	"PostReview",
	{
		postId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Post,
				key: "id",
			},
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			primaryKey: true,
		},
		comment: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		rating: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			validate: {
				min: 1,
				max: 5,
			},
		},
	},
	{
		tableName: "PostReviews",
	},
);

export { PostReview };