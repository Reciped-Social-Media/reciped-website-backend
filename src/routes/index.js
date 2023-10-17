import express from "express";
import account from "./account/index.js";
import cookbook from "./cookbook/index.js";
import interaction from "./interaction/index.js";
import explore from "./explore/index.js";
import recipe from "./recipe/index.js";
import pantry from "./pantry/index.js";
import mealplan from "./mealplan/index.js";
import chef from "./chef/index.js";

const router = express.Router();

router.use("/account", account);
router.use("/cookbook", cookbook);
router.use("/interaction", interaction);
router.use("/explore", explore);
router.use("/recipe", recipe);
router.use("/pantry", pantry);
router.use("/mealplan", mealplan);
router.use("/chef", chef);

export default router;