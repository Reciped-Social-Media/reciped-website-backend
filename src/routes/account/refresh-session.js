import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Session, SessionRefreshToken } from "../../database/index.js";
import { generateJwt } from "../../utils/index.js";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
	const { sessionId, refreshToken } = req.body;

	if (!refreshToken || !sessionId || typeof refreshToken !== "string" || typeof sessionId !== "string") {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const session = await Session.findOne({ where: { uuid: sessionId }, include: [{ model: SessionRefreshToken }] })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!session) return;

	const sessionRefreshTokensOrdered = session.SessionRefreshTokens.sort((a, b) => a.id - b.id);
	const refreshTokenExists = sessionRefreshTokensOrdered.some(sessionRefreshToken => sessionRefreshToken.refreshToken === refreshToken);

	if (!refreshTokenExists) {
		res.status(403).send({ error: "Invalid refresh token!" });
		return;
	}

	const latestRefreshToken = sessionRefreshTokensOrdered[sessionRefreshTokensOrdered.length - 1].refreshToken;

	if (latestRefreshToken !== refreshToken) {
		// Account has been logged into elsewhere by a potential bad actor
		// Delete all refresh tokens and sessions to prevent further access
		await session.destroy({ where: { sessionId } })
			.catch(err => {
				console.log(err);
				res.status(500).send({ error: "Something went wrong!" });
			});
		res.status(409).send({ error: "Account has been logged in from elsewhere! Please log in again." });
		return;
	}

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
		if (err) {
			await session.destroy({ where: { sessionId } })
				.catch(err => {
					console.log(err);
					res.status(500).send({ error: "Something went wrong!" });
				});
			res.status(403).send({ error: "Invalid refresh token! Please log in again." });
			return;
		}

		if (user.userId !== session.userId) {
			res.status(403).send({ error: "Unauthorized user!" });
			return;
		}

		const { accessToken, refreshToken: newRefreshToken } = generateJwt(session.userId);
		await SessionRefreshToken.create({ sessionId: session.uuid, refreshToken: newRefreshToken })
			.catch(err => {
				console.log(err);
				res.status(500).send({ error: "Something went wrong!" });
			});

		res.send({ accessToken, refreshToken: newRefreshToken });
	});
});

export default router;