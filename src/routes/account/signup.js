import express from "express";
import bcrypt from "bcrypt";
import { User } from "../../database/index.js";

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

	res.status(201).send({ message: "Account created successfully!" });
});

export default router;