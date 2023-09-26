import express from "express";
import { generateJwt } from "../../utils/index.js";
import bcrypt from "bcrypt";
import { Session, SessionRefreshToken, User } from "../../database/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password || typeof username !== "string" || typeof password !== "string") {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	const user = await User.findOne({ where: { username } });
	if (!user) {
		res.status(404).send({ error: "Account not found!" });
		return;
	}

	const validPassword = bcrypt.compareSync(password, user.passwordHash);
	if (!validPassword) {
		res.status(401).send({ error: "Invalid credentials!" });
		return;
	}

	const { accessToken, refreshToken } = await generateJwt(user.id);
	const ONE_HOUR = 60 * 60 * 1000;
	const session = await Session.create({ userId: user.id, expiresAt: Date.now() + ONE_HOUR })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!session) return;
	const sessionId = session.uuid;

	await SessionRefreshToken.create({ sessionId: session.uuid, refreshToken })
		.catch(async err => {
			console.log(err);
			console.log("Deleting session due to error...");
			await session.destroy().catch(() => console.log("Failed to delete session!"));
			res.status(500).send({ error: "Something went wrong!" });
		});

	res.send({ sessionId, accessToken, refreshToken, username });
});

export default router;