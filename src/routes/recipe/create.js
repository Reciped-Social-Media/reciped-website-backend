import express from "express";
import { Op, col, fn, where } from "sequelize";
import { Ingredient, Recipe } from "../../database/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const { userId, title, ingredients, directions } = req.body;

	if (
		!title || typeof title !== "string" ||
		!ingredients || !Array.isArray(ingredients) || ingredients.length === 0 || !ingredients.every(ing => typeof ing === "string") ||
		!directions || !Array.isArray(directions) || directions.length === 0 || !directions.every(dir => typeof dir === "string")
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}
	const NER = [];
	const numIngredients = ingredients.length;
	let numValidIngredients = 0;
	await Promise.all(ingredients.map(async (ingredient) => {
		const foundIngredients = await Ingredient.findAll({
			where: where(fn("POSITION", where(col("name"), Op.in, ingredient)), Op.gt, 0),
		}).catch((err) => console.log(err));
		if (foundIngredients.length > 0) {
			numValidIngredients++;
			const ingredientCharLengths = foundIngredients.map(ing => ing.dataValues.name.length);
			const ingredientIndex = ingredientCharLengths.indexOf(Math.max(...ingredientCharLengths));
			NER.push(foundIngredients[ingredientIndex].dataValues.name);
		}
		return;
	}));
	if (numValidIngredients !== numIngredients) {
		res.status(404).send({ error: "One or more ingredients do not exist" });
		return;
	}
	const recipe = await Recipe.create({
		title,
		ingredients,
		directions,
		NER,
	}).catch((err) => {
		console.log(err);
		res.status(500).send({ error: "Something went wrong!" });
		return;
	});
	if (!recipe) return;
	res.status(200).send({ recipeId: recipe.dataValues.id });
});

export default router;