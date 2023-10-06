import express from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { UserMealPlan } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, recipeId, date, time, source } = req.body;
	console.log(req.body);

	const response = await UserMealPlan.findOne({ where: { userId, date, time } });
	console.log("RES", response);
	if (response) {
		res.send({ error: "Already have a recipe in this timeslot" });
		return;
	}
	const addedMeal = await UserMealPlan.findOrCreate({ where: { userId, recipeId, date, time, source } })
		.catch(err => {
			console.error(err);
			res.send({ error: "Something went wrong!" });
		});

	if (!addedMeal) return;
	res.sendStatus(200);
});

export default router;