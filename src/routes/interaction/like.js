import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { PostLike, User } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, postId } = req.body;

	if (
		!postId || typeof postId !== "number"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const like = await PostLike.findOrCreate({ where: { userId, postId } })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!like) return;

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

	const likes = await PostLike.findAll({ where: { postId: postId }, include: [{ model: User }] })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!likes) return;

	const returnData = likes.map(like => {
		return {
			id: like.user.id,
			username: like.user.username,
		};
	});

	res.status(200).send(returnData);
});

export default router;
