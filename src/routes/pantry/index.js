import express from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { Ingredient, UserIngredient } from "../../database/index.js";
import add from "./add.js";
import search from "./search.js";
import remove from "./remove.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		res.send({ error: "Invalid Id" });
		return;
	}

	const ingredients = await UserIngredient.findAll({ where: { userId }, include: [{ model: Ingredient }] });
	if (!ingredients) {
		res.send({ error: "Something went wrong" });
	}
	const userIngredients = ingredients.map(ing => ({
		storage : ing.dataValues.storage,
		unit: ing.dataValues.unit,
		amount: ing.dataValues.amount,
		name: ing.dataValues.Ingredient.dataValues.name,
		ingredientId: ing.dataValues.ingredientId,
	}));
	res.send(userIngredients);
});

router.use("/add", add);
router.use("/search", search);
router.use("/remove", remove);


export default router;