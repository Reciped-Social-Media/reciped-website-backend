import express from "express";
import { Recipe, RecipeIngredient } from "../../database/index.js";
import { Op } from "sequelize";
import create from "./create.js";

const router = express.Router();

async function findRecipesFromQueryString(queryString) {
	const [recipeResults, ingredientResults] = await Promise.all([
		Recipe.findAll({
			where: { title: { [Op.iLike]: queryString } },
			limit: 20,
		}),
		RecipeIngredient.findAll({
			attributes: [],
			where: { ingredientName: { [Op.iLike]: queryString } },
			limit: 20,
			include: {
				model: Recipe,
				attributes: ["id", "title", "ingredients", "directions", "NER"],
			},
		}),
	]);

	const recipesRaw = [...recipeResults, ...ingredientResults.map((r) => r.Recipe)];
	const uniqueRecipeIds = new Set();
	const uniqueRecipes = [];

	for (const recipe of recipesRaw) {
		if (!uniqueRecipeIds.has(recipe.id)) {
			uniqueRecipeIds.add(recipe.id);
			uniqueRecipes.push({
				id: recipe.id,
				title: recipe.title,
				ingredients: recipe.ingredients,
				directions: recipe.directions,
				NER: recipe.NER,
			});
		}
	}

	return uniqueRecipes;
}

async function findRecipeById(recipeId) {
	const recipeResult = await Recipe.findOne({
		where: { id: recipeId },
	}).catch((err) => { console.log(err); return null; });

	if (!recipeResult) {
		return null;
	}

	const { id, title, ingredients, directions, NER } = recipeResult;

	return { id, title, ingredients, directions, NER };
}

router.get("/", async (req, res) => {
	const { queryString, recipeId } = req.query;

	if (!queryString || typeof queryString !== "string") {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	if (recipeId && typeof recipeId !== "number") {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const [queryResults, idResult] = await Promise.all([
		findRecipesFromQueryString(queryString),
		recipeId ? findRecipeById(recipeId) : null,
	]);

	const recipes = idResult && queryResults.every(p => p.id !== idResult.id) ? [...queryResults, idResult] : queryResults;

	res.send(recipes);
});

router.use("/create", create);

export default router;

