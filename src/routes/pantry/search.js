import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Ingredient } from "../../database/index.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const { name } = req.query;

	if (!name || typeof name !== "string") {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const ingredientsModels = await Ingredient.findAll({
		where: { name: { [Op.iLike]: name } },
	}).catch((err) => {
		console.log(err);
		res.status(500).send({ error: "Something went wrong" });
		return;
	});
	if (!ingredientsModels) return;

	const ingredients = ingredientsModels.map(ing => { return { name: ing.dataValues.name, id: ing.dataValues.id }; });

	const exactMatch = ingredients.find(ing => ing.name.toLowerCase() === name.toLowerCase());
	if (exactMatch) {
		res.send([exactMatch]);
		return;
	}
	res.send(ingredients);
});

export default router;