import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function authenticateToken(req, res, next) {
	const authHeader = req.headers.Authorization || req.headers.authorization;

	if (!authHeader || typeof authHeader !== "string") {
		await res.status(403).send({ error: "Invalid authorization token" });
		return;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		await res.status(403).send({ error: "Invalid authorization token" });
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send({ error: "Unauthorised!" });
		req.body.userId = user.userId;
		next();
	});
}