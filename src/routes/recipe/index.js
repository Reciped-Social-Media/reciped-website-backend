import express from "express";
import { Recipe } from "../../database/index.js";
import { Op } from "sequelize";
import create from "./create.js";
import { authenticateToken } from "../../middleware/index.js";

const router = express.Router();

async function findRecipesFromQueryString(queryString) {
	const recipeResults = await Recipe.findAll({
		where: { title: { [Op.iLike]: `%${queryString}%` } },
		limit: 50,
	});
	const recipes = recipeResults.map(rec => rec.dataValues);
	return recipes;
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

router.get("/", authenticateToken, async (req, res) => {
	const { queryString, recipeId } = req.query;
	console.log("HERE", queryString, recipeId);

	if (queryString && typeof queryString === "string") {
		const queryResult = await findRecipesFromQueryString(queryString);
		res.send(queryResult);
		return;
	}

	if (recipeId && typeof recipeId === "string") {
		const idResult = await findRecipeById(recipeId);
		res.send(idResult);
		return;
	}

	res.status(400).send({ error: "Invalid format" });
});

router.use("/create", create);

export default router;

