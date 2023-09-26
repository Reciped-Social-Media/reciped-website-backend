import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateJwt(userId) {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15min",
	});
	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET);
	return { accessToken, refreshToken };
}