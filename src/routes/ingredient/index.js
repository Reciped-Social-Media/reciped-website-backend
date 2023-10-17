import express from "express";
import validate from "./validate.js";

const router = express.Router();

router.use("/validate", validate);

export default router;