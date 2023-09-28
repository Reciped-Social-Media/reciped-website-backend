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
	console.log("HERE", queryString, recipeId);

	if (queryString && typeof queryString === "string") {
		const queryResult = await findRecipesFromQueryString(queryString);
		res.send(queryResult);
		return;
	}

	if (recipeId && typeof recipeId === "string") {
		console.log("Here2");
		const idResult = await findRecipeById(recipeId);
		res.send(idResult);
		return;
	}

	console.log("Here3");
	res.send({ error: "Invalid query format" });
});

router.use("/create", create);

export default router;

