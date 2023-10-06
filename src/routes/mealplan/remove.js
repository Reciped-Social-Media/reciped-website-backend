import express from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { UserMealPlan } from "../../database/index.js";
import dayjs from "dayjs";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, recipeId, date } = req.body;
	const newDate = dayjs(date);

	const removedMeal = await UserMealPlan.destroy({ where: { userId, recipeId, date: newDate } })
		.catch(err => {
			console.error(err);
			res.send({ error: "Something went wrong!" });
		});
	if (!removedMeal) return;
	res.sendStatus(200);
});

export default router;