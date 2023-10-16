import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { PostLike } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, postId } = req.body;

	if (
		!postId || typeof postId !== "number"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const like = await PostLike.destroy({ where: { userId, postId } })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (typeof like !== "number") return;

	res.sendStatus(200);
});

export default router;