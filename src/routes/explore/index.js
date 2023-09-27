import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Post, Recipe, User } from "../../database/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const userPosts = await Post.findAll({ include : [{ model: User }, { model: Recipe }] });
	const explorePosts = userPosts.map(post => {
		const { id, recipeId, caption, category } = post.dataValues;
		const username = post.dataValues.User.dataValues.username;
		const title = post.dataValues.Recipe.dataValues.title;
		return {
			id,
			recipeId,
			caption,
			category,
			username,
			title,
		};
	});
	res.send(explorePosts);
});

export default router;