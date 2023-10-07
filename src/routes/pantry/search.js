import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Ingredient } from "../../database/index.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const { name } = req.query;

	if (!name) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const ingredients = await Ingredient.findAll({
		where: { name: { [Op.iLike]: `%${name}%` } },
	});

	const sendIngredients = ingredients.map(ing => ing.dataValues);
	console.log(sendIngredients);

	let exactIngredient = null;

	sendIngredients.map(ingredient => {
		if (ingredient.name === name) exactIngredient = ingredient;
	});

	if (exactIngredient) {
		res.send([exactIngredient]);
		return;
	}

	if (sendIngredients.length < 1) {
		res.status(404).send("Oops...can't find that");
		return;
	}

	res.send(sendIngredients);
	return;
});

export default router;