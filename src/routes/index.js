import express from "express";
import account from "./account/index.js";
import cookbook from "./cookbook/index.js";
import interaction from "./interaction/index.js";
import explore from "./explore/index.js";

const router = express.Router();

router.use("/account", account);
router.use("/cookbook", cookbook);
router.use("/interaction", interaction);
router.use("/explore", explore);

export default router;