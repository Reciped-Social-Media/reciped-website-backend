import express from "express";
import recommend from "./recommend.js";
import { authenticateToken } from "../../middleware/index.js";
import { Recipe, UserIngredient, sequelize } from "../../database/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const { userId } = req.body;

	const ingredients = await UserIngredient.findAll({ where: { userId } }).catch((err) => {
		console.log(err);
		res.status(500).send({ error: "Something went wrong" });
		return;
	});
	if (!ingredients) return;

	// TODO: Get recipe recommendations based on ingredients in pantry
	// Placeholder - Get 20 random recipes
	const recipes = await Recipe.findAll({ order: sequelize.random(), limit: 5 }).catch((err) => {
		console.log(err);
		res.status(500).send({ error: "Something went wrong" });
		return;
	});
	if (!recipes) return;

	res.send(recipes.map(recipe => { return { title: recipe.dataValues.title, ingredients: recipe.dataValues.ingredients, directions: recipe.dataValues.directions }; }));
});

router.use("/recommend", recommend);

export default router;