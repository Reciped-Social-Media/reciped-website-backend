import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Recipe } from "../../database/index.js";
import fetch from "node-fetch";
import { Op } from "sequelize";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { ingredients } = req.body;

	if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0 || ingredients.some(ingredient => typeof ingredient !== "string")) {
		return res.status(400).json({ error: "Invalid format" });
	}

	let recommendedIds;
	fetch("http://localhost:105/recommend", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			chef: true,
			input: [ingredients],
		}),
	})
		.then(response => response.json())
		.then(json => recommendedIds = json.recommendations)
		.catch(() => recommendedIds = undefined);

	if (!recommendedIds) {
		return res.status(500).json({ error: "Something went wrong!" });
	}

	const recommendedRecipes = await Recipe.findAll({
		where: {
			[Op.in]: recommendedIds,
		},
	});

	res.send(recommendedRecipes.map(recipe => {
		return {
			id: recipe.id,
			title: recipe.title,
			ingredients: recipe.ingredients,
			directions: recipe.directions,
		};
	}));
});

export default router;