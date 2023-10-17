import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import {
	UserMealPlan,
	Recipe,
	UserRecipe,
} from "../../database/index.js";

import add from "./add.js";
import remove from "./remove.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const userId = req.body;

	const cookRec = await UserRecipe.findAll({
		where: userId,
		include: [{ model: Recipe }],
	}).catch((err) => {
		console.error(err);
		res.status(500).send({ error: "Something went wrong" });
	});
	if (!cookRec) return;
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
	}).catch((err) => {
		console.error(err);
		res.status(500).send({ error: "Something went wrong" });
	});
	if (!userRec) return;
	const userRecipes = userRec.map(rec => {
		const { id, recipeId, date, time, source } = rec.dataValues;
		const { title } = rec.dataValues.Recipe.dataValues;
		return {
			id,
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
