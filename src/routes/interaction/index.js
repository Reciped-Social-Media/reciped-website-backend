import express from "express";
import like from "./like.js";
import post from "./post.js";
import review from "./review.js";

const router = express.Router();

router.use("/like", like);
router.use("/post", post);
router.use("/review", review);

export default router;