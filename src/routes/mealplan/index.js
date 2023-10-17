import express from "express";
import axios from "axios";
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

	const userRecIds = cookbookRecipes.map(rec => rec.recipeId);

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

	console.log("CookbookIDs", userRecIds);

	const data = {
		input: userRecIds,
		chef: false,
	};

	const recommendations = await axios.post("http://0.0.0.0:105/recommend", data);
	const recommendedIds = recommendations.data.recommendations.map(rec => rec[1]);
	console.log(userRecIds);
	console.log(recommendedIds);
	const recommendedRecipes = [];

	await Promise.all(recommendedIds.map(async (rec_id, index) => {
		const recRecipe = await Recipe.findOne({ where: { id: rec_id } });
		const { id, title, ingredients, directions } = recRecipe.dataValues;
		recommendedRecipes.push({
			recipeId: id,
			recommendedId: userRecIds[index],
			title,
			ingredients,
			directions,
		});
	}));


	res.send({ cookbook: cookbookRecipes, planner: userRecipes, recommended: recommendedRecipes });
});

router.use("/add", add);
router.use("/remove", remove);

export default router;
