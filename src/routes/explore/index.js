import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Post, PostReview, Recipe, User } from "../../database/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const userPosts = await Post.findAll({ include : [{ model: User }, { model: Recipe }, { model: PostReview }] });
	const explorePosts = userPosts.map(post => {
		const { id, recipeId, caption, category, createdAt } = post.dataValues;
		const reviews = post.dataValues.PostReviews;
		const ratings = reviews.map(rev => rev.dataValues.rating);
		const sum = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
		const rating = sum / ratings.length;
		const username = post.dataValues.User.dataValues.username;
		const title = post.dataValues.Recipe.dataValues.title;
		return {
			id,
			recipeId,
			caption,
			category,
			username,
			title,
			createdAt,
			rating,
		};
	});

	res.send({ post: explorePosts });
});

export default router;