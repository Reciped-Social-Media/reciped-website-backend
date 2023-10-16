import express from "express";
import like from "./like.js";
import unlike from "./unlike.js";
import post from "./post.js";
import review from "./review.js";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { PostLike, PostReview, User } from "../../database/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
	const query = req.query;
	const postId = Number(query.id);
	const postData = await PostLike.findAll({ where: { postId }, include: [{ model: User }] });
	const likes = postData.map(p => p.dataValues.User.dataValues.username);
	const postReviews = await PostReview.findAll({ where: { postId }, include: [{ model: User }] });
	const ratings = postReviews.map(r => {
		if (r.dataValues.rating !== null) {
			return {
				username: r.dataValues.User.dataValues.username,
				rating: r.dataValues.rating,
			};
		}
	});
	const comments = [];
	postReviews.map(r => {
		if (typeof r.dataValues.comment === "string") {
			comments.push({
				username: r.dataValues.User.dataValues.username,
				comment: r.dataValues.comment,
			});
		}
	});
	res.send({ likes, ratings, comments });
});

router.use("/like", like);
router.use("/unlike", unlike);
router.use("/post", post);
router.use("/review", review);

export default router;