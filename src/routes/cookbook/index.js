import express from "express";
import add from "./add.js";
import remove from "./remove.js";
import togglePublic from "./toggle-public.js";
import { authenticateToken } from "../../middleware/index.js";
import { Recipe, UserRecipe } from "../../database/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const { userId } = req.body;

	const userRecipes = await UserRecipe.findAll({ where: { userId }, include: [{ model: Recipe }] })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!userRecipes) return;

	const recipes = userRecipes.map((userRecipe) => {
		const { recipeId, category, isPublic } = userRecipe;
		const { title, ingredients, directions } = userRecipe.Recipe;

		return { recipeId, title, ingredients, directions, category, isPublic };
	});

	res.send(recipes.sort((a, b) => a.recipeId - b.recipeId));
});

router.use("/add", add);
router.use("/remove", remove);
router.use("/toggle-public", togglePublic);

export default router;