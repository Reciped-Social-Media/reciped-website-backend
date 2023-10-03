import express from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { UserIngredient } from "../../database/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const userId = req.body.userId;
	const { ingredientId } = req.query;

	if (!ingredientId) {
		res.send({ error: "Invalid query" });
		return;
	}

	await UserIngredient.destroy({ where: { userId, ingredientId } });
	res.sendStatus(200);
});

export default router;