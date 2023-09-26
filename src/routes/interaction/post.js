import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Post, PostLike, PostReview } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, recipeId, caption } = req.body;

	if (
		!recipeId || typeof recipeId !== "number" ||
		!caption || typeof caption !== "string"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	if (caption.length > 1024) {
		res.status(400).send({ error: "Caption too long!" });
		return;
	}

	const post = await Post.create({ userId, recipeId, caption })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!post) return;

	res.sendStatus(200);
});

router.get("/", async (req, res) => {
	const { postId } = req.query;

	if (
		!postId || typeof postId !== "string"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const post = await Post.findOne({ where: { postId }, include: [{ model: PostLike }, { model: PostReview }] })
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
		postId: post.postId,
		userId: post.userId,
		recipeId: post.recipeId,
		caption: post.caption,
		likes: post.postLikes.length,
		reviews: post.postReviews.length,
		rating: post.postReviews.length > 0 ? post.postReviews.reduce((acc, cur) => acc + cur.rating, 0) / post.postReviews.length : 0,
	});
});

export default router;