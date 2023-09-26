import express from "express";
import signup from "./signup.js";
import login from "./login.js";
import logout from "./logout.js";
import refreshSession from "./refresh-session.js";

const router = express.Router();
router.use("/signup", signup);
router.use("/login", login);
router.use("/logout", logout);
router.use("/refresh-session", refreshSession);

export default router;