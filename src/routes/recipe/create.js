import express from "express";
import { authenticateToken } from "../../middleware/index.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
	// TODO: Implement
	res.sendStatus(200);
});

export default router;