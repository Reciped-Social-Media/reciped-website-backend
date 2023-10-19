import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Recipe } from "../../database/index.js";
import axios from "axios";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { ingredients } = req.body;

	if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0 || ingredients.some(ingredient => typeof ingredient !== "string")) {
		return res.status(400).json({ error: "Invalid format" });
	}

	const data = {
		chef: true,
		input: [ingredients],
	};

	const reco = await axios.post("http://0.0.0.0:105/recommend", data);
	const recommendedIds = reco.data.recommendations[0];

	if (!recommendedIds) {
		return res.status(500).json({ error: "Something went wrong!" });
	}

	let recommendedRecipes = await Recipe.findAll({
		where: {
			id: recommendedIds,
		},
	});

	recommendedRecipes = recommendedRecipes.map(rec => ({
		id: rec.dataValues.id,
		title: rec.dataValues.title,
		ingredients: rec.dataValues.ingredients,
		directions: rec.dataValues.directions,
		NER: rec.dataValues.NER,
	}));

	res.send(recommendedRecipes);
});

export default router;