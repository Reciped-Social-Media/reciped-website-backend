import express from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { UserIngredient } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const userId = req.body.userId;
	const { ingredientId, storage, unit, amount } = req.body;

	if (!ingredientId || !storage || !unit || !amount) {
		res.send({ error: "Invalid request" });
		return;
	}

	const addedIngredient = await UserIngredient.findOrCreate({ where: { userId, ingredientId, storage, unit, amount } })
		.catch(err => {
			console.error(err);
			res.send({ error: "Something went wrong!" });
		});

	if (!addedIngredient) return;
	res.sendStatus(200);
});

export default router;