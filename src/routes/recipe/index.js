import express from "express";
import { Recipe } from "../../database/index.js";
// import { Op } from "sequelize";
import create from "./create.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const { recipeId } = req.query;

	if (
		!recipeId || typeof recipeId !== "string"
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const recipe = await Recipe.findAll({ where: { id: recipeId } })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!recipe) return;

	res.send(recipe.map(r => ({
		recipeId: r.id,
		title: r.title,
		ingredients: r.ingredients,
		directions: r.directions,
		NER: r.NER,
	})));
});

router.use("/create", create);

export default router;

