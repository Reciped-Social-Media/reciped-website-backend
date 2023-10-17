import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Post, PostLike, PostReview, Recipe, User } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, recipeId, caption, category } = req.body;

	if (
		!recipeId || typeof recipeId !== "number" ||
		!caption || typeof caption !== "string" ||
		!category || typeof category !== "string"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	if (caption.length > 1024) {
		res.status(400).send({ error: "Caption too long!" });
		return;
	}

	const post = await Post.create({ userId, recipeId, caption, category })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!post) return;
	res.status(200).send({ postId: post.dataValues.id });
});

router.get("/", authenticateToken, async (req, res) => {
	const { userId } = req.body;
	const { postId } = req.query;

	if (
		!postId || typeof postId !== "string"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const post = await Post.findOne({ where: { id: postId }, include: [{ model: Recipe }, { model: User }, { model: PostLike }, { model: PostReview }] })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (post === null) {
		res.status(404).send({ error: "Post not found!" });
		return;
	}
	if (!post) return;

	res.status(200).send({
		id: post.dataValues.id,
		user: {
			id: post.dataValues.User.dataValues.id,
			username: post.dataValues.User.dataValues.username,
		},
		recipe: {
			id: post.dataValues.Recipe.dataValues.id,
			title: post.dataValues.Recipe.dataValues.title,
			ingredients: post.dataValues.Recipe.dataValues.ingredients,
			directions: post.dataValues.Recipe.dataValues.directions,
		},
		caption: post.dataValues.caption,
		category: post.dataValues.category,
		likes: post.dataValues.PostLikes.length,
		liked: post.dataValues.PostLikes.map(like => like.dataValues.userId).includes(Number(userId)),
		reviews: post.dataValues.PostReviews.length,
		rating: post.dataValues.PostReviews.length > 0 ? Math.round(post.dataValues.PostReviews.reduce((acc, cur) => acc + cur.dataValues.rating * 2, 0) / post.dataValues.PostReviews.length) / 2 : 0,
	});
});

export default router;