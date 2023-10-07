import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserMealPlan } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, recipeId, dateEpochMs, time, source } = req.body;
	console.log(req.body);

	if (
		!recipeId || typeof recipeId !== "number" ||
		!date || typeof date !== "number" ||
		!time || ["Breakfast", "Lunch", "Dinner", "Dessert"].includes(time) ||
		!source || ["Cookbook", "Planner"].includes(source)
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	let dateExact;
	try {
		dateExact = new Date(dateEpochMs);
	}
	catch {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const date = new Date(dateExact.getFullYear(), dateExact.getMonth(), dateExact.getDate());

	const exists = await UserMealPlan.findOne({ where: { userId, recipeId, date } })
		.catch(err => {
			console.error(err);
			res.status(500).send({ error: "Something went wrong!" });
			return "error";
		});
	if (exists === "error") return;
	if (exists && exists !== "error") {
		res.status(409).send({ error: "Meal already exists!" });
		return;
	}

	const meal = await UserMealPlan.create({ userId, recipeId, date, time, source })
		.catch(err => {
			console.error(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!meal) return;

	res.sendStatus(200);
});

export default router;