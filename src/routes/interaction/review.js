import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { PostReview, User } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, postId, rating } = req.body;
	let { comment } = req.body;

	if (
		!postId || typeof postId !== "number"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	if (comment && typeof comment !== "string") comment = null;

	const review = await PostReview.create({ userId, postId, rating, comment })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!review) return;

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

	const reviews = await PostReview.findAll({ where: { postId: postId }, include: [{ model: User }] })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!reviews) return;

	const returnData = reviews.map(review => {
		return {
			id: review.User.id,
			username: review.User.username,
			rating: review.rating,
			comment: review.comment,
		};
	});

	res.status(200).send(returnData);
});

export default router;