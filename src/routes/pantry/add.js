import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserIngredient } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, ingredientId, storage, unit, amount } = req.body;
	console.log(userId, ingredientId, storage, unit, amount);

	if (
		!ingredientId || typeof ingredientId !== "number" ||
		!storage || typeof storage !== "string" ||
		!unit || typeof unit !== "string" ||
		!amount
	) {
		console.log("here");
		res.status(400).send("Invalid format");
		return;
	}

	const ingredient = await UserIngredient.findOrCreate({ where: { userId, ingredientId, storage, unit, amount } })
		.catch((err) => {
			console.log(err);
			res.status(500).send("Something went wrong!");
			return;
		});
	if (!ingredient) return;
	res.sendStatus(200);
});

export default router;