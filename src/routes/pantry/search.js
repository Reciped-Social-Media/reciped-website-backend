import express from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { Ingredient } from "../../database/index.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const { name } = req.query;

	if (!name) {
		res.send({ error: "Invalid query" });
		return;
	}

	const ingredients = await Ingredient.findAll({
		where: { name: { [Op.iLike]: `%${name}%` } },
	});

	const sendIngredients = ingredients.map(ing => ing.dataValues);

	let exactIngredient = null;

	sendIngredients.map(ingredient => {
		if (ingredient.name === name) exactIngredient = ingredient;
	});

	if (exactIngredient) {
		res.send([exactIngredient]);
		return;
	}

	res.send(sendIngredients);
	return;
});

export default router;