import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserMealPlan } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, mealPlanId } = req.body;

	if (!mealPlanId || typeof mealPlanId !== "number") {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const mealPlan = await UserMealPlan.findOne({ where: { userId, id: mealPlanId } })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!mealPlan) {
		res.status(404).send({ error: "Meal plan not found!" });
		return;
	}

	mealPlan.destroy().then(() => {
		res.sendStatus(200);
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: "Something went wrong!" });
	});
});

export default router;