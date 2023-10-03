import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserRecipe } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, recipeId } = req.body;
	let { category, isPublic } = req.body;

	if (
		!recipeId || typeof recipeId !== "number"
	) {
		res.send({ error: "Invalid format" });
		return;
	}

	if (typeof category !== "string") category = "All";
	if (typeof isPublic !== "boolean") isPublic = false;

	const recipeCreation = await UserRecipe.findOrCreate({ where: { userId, recipeId }, defaults: { category, isPublic } })
		.catch(err => {
			console.log(err);
			res.send({ error: "Something went wrong!" });
		});
	if (!recipeCreation) return;

	const recipe = recipeCreation[0];

	const updatedRecipe = await recipe.update({ category, isPublic })
		.catch(err => {
			console.log(err);
			res.send({ error: "Something went wrong!" });
		});
	if (!updatedRecipe) return;

	res.sendStatus(200);
});

export default router;