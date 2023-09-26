import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserRecipe } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, recipeId } = req.body;

	if (
		!recipeId || typeof recipeId !== "number"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const recipeDeletion = await UserRecipe.destroy({ where: { userId, recipeId } })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!recipeDeletion) return;

	res.sendStatus(200);
});

export default router;