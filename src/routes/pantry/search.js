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

	const ingredients = ingredientsModels.map(ing => ing.dataValues.name);

	if (ingredients.includes(name)) {
		res.send({ ingredients: [name] });
		return;
	}
	else {
		res.send({ ingredients });
		return;
	}
});

export default router;