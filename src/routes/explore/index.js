import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Post, PostReview, Recipe, User } from "../../database/index.js";
import { Op } from "sequelize";

const router = express.Router();

function generateRandomIds(count, maxId) {
	const randomIds = [];
	while (randomIds.length < count) {
		const randomId = Math.floor(Math.random() * (maxId + 1));
		if (!randomIds.includes(randomId)) {
			randomIds.push(randomId);
		}
	}
	return randomIds;
}

router.get("/", authenticateToken, async (req, res) => {

	const numberOfRecipesToFetch = 20;
	const maxId = 2140392;
	const randomIds = generateRandomIds(numberOfRecipesToFetch, maxId);

	const random = await Recipe.findAll({
		where: {
			id: {
				[Op.in]: randomIds,
			},
		},
	});
	const picks = random.map(rec => {
		const { id, title } = rec.dataValues;
		return {
			recipeId: id,
			title,
			caption: "Give this a try!",
			username: "Reciped",
			rating: 3,
			category: "All",
		};
	});

	const userPosts = await Post.findAll({
		include: [{ model: User }, { model: Recipe }, { model: PostReview }],
	});

	const posts = userPosts.map((post) => {
		const { id, recipeId, caption, category, createdAt } = post.dataValues;
		const reviews = post.dataValues.PostReviews;
		const ratings = reviews.map((rev) => rev.dataValues.rating);
		const sum = ratings.reduce(
			(accumulator, currentValue) => accumulator + currentValue,
			0,
		);
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

	res.send({ posts, picks });
});

export default router;
