import express from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import {
	UserMealPlan,
	Recipe,
	UserRecipe,
} from "../../database/associations.js";

import add from "./add.js";
import remove from "./remove.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const userId = req.body;

	const cookRec = await UserRecipe.findAll({
		where: userId,
		include: [{ model: Recipe }],
	});
	const cookbookRecipes = cookRec.map((rec) => {
		const { recipeId, category } = rec.dataValues;
		const { title } = rec.dataValues.Recipe.dataValues;
		return {
			recipeId,
			category,
			title,
		};
	});

	const userRec = await UserMealPlan.findAll({
		where: userId,
		include: [{ model: Recipe }],
	});
	const userRecipes = userRec.map(rec => {
		const { recipeId, date, time, source } = rec.dataValues;
		const { title } = rec.dataValues.Recipe.dataValues;
		return {
			recipeId,
			date,
			time,
			source,
			title,
		};
	});

	res.send({ cookbook: cookbookRecipes, planner: userRecipes });
});

router.use("/add", add);
router.use("/remove", remove);

export default router;
