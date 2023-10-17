import express from "express";
import bcrypt from "bcrypt";
import { Session, SessionRefreshToken, User } from "../../database/index.js";
import { generateJwt } from "../../utils";

const router = express.Router();

router.post("/", async (req, res) => {
	const { firstName, lastName, username, password } = req.body;

	const fields = [firstName, lastName, username, password];
	if (
		fields.some(field => !field) ||
		fields.some(field => typeof field !== "string")
	) {
		res.status(400).send({ error: "Invalid format" });
		return;
	}

	try {
		const existingUser = await User.count({
			where: {
				username,
			},
		});
		if (existingUser > 0) {
			res.status(409).send({ error: "This username already exists" });
			return;
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ error: "Something went wrong!" });
		return;
	}

	// Validate password is secure
	// 8+ characters, 1+ uppercase, 1+ lowercase, 1+ number, 1+ special character (*[!@#$%^&*()\-__+.])
	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;
	if (!passwordRegex.test(password)) {
		res.status(400).send({ error: "Insecure password provided!" });
		return;
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ firstName, lastName, username, passwordHash })
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: "Something went wrong!" });
		});
	if (!user) return;

	const { accessToken, refreshToken } = generateJwt(user.id);
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