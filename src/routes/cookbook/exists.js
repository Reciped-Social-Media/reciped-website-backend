import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserRecipe } from "../../database/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const { recipeId } = req.query;
	const { userId } = req.body;

	if (
		!recipeId || isNaN(Number(recipeId))
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const recipe = await UserRecipe.findOne({ where: { userId, recipeId } })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!recipe && recipe !== null) return;
	res.send(!!recipe);
});

export default router;
