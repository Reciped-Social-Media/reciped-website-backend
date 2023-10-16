import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Ingredient } from "../../database/index.js";
import { Op, col, fn, where } from "sequelize";

const router = express.Router();

// Validate if ingredient exists
router.post("/", authenticateToken, async (req, res) => {
	const { ingredient } = req.body;

	if (!ingredient || typeof ingredient !== "string") {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const foundIngredients = await Ingredient.findAll({
		where: where(fn("POSITION", where(col("name"), Op.in, ingredient)), Op.gt, 0),
	})
		.catch((err) => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong" });
			return;
		});
	if (!foundIngredients) return;

	if (foundIngredients.length > 0) res.send({ exists: true });
	else res.send({ exists: false });
});