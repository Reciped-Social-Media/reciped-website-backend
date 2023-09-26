import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./User.js";
import { Post } from "./Post.js";

const PostLike = sequelize.define(
	"PostLike",
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
	},
	{
		tableName: "PostLikes",
	},
);

export { PostLike };

