import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { UserIngredient, Recipe, sequelize } from "../../database/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	const { userId, ingredients } = req.body;
	// Make recommendations based on ingredients given
});

export default router;