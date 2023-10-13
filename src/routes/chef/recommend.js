import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserIngredient, Recipe, sequelize } from "../../database/index.js";

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
	const recipes = await Recipe.findAll({ order: sequelize.random(), limit: 20 }).catch((err) => {
		console.log(err);
		res.status(500).send({ error: "Something went wrong" });
		return;
	});
	if (!recipes) return;

	res.send(recipes);
});

export default router;