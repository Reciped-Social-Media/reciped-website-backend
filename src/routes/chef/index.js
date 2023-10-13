import express from "express";
import recommend from "./recommend.js";

const router = express.Router();

router.use("/recommend", recommend);

export default router;