import express from "express";
import { Session } from "../../database/index.js";
import { authenticateToken } from "../../middleware/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { sessionId, userId } = req.body;

	if (!sessionId || typeof sessionId !== "string") {
		res.status(400).send({ error: "Invalid format" });
	}

	const destroyed = await Session.destroy({ where: { uuid: sessionId, userId } })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (typeof destroyed !== "number") return;

	if (destroyed === 0) {
		res.status(404).send({ error: "Session not found!" });
		return;
	}

	res.sendStatus(200);
});

export default router;