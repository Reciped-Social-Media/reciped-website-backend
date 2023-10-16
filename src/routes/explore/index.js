import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import { Post, PostLike, PostReview, Recipe, User } from "../../database/index.js";
import { Op, col } from "sequelize";

const router = express.Router();

async function findPostById(postId, userId) {
	const post = await Post.findOne({ where: { id: postId }, include: [{ model: Recipe }, { model: User }, { model: PostLike }, { model: PostReview }] })
		.catch(err => {
			console.log(err);
			return null;
		});
	if (!post) return null;
	return {
		id: post.dataValues.id,
		user: {
			id: post.dataValues.User.dataValues.id,
			username: post.dataValues.User.dataValues.username,
		},
		recipe: {
			id: post.dataValues.Recipe.dataValues.id,
			title: post.dataValues.Recipe.dataValues.title,
			ingredients: post.dataValues.Recipe.dataValues.ingredients,
			directions: post.dataValues.Recipe.dataValues.directions,
		},
		caption: post.dataValues.caption,
		category: post.dataValues.category,
		likes: post.dataValues.PostLikes.length,
		liked: post.dataValues.PostLikes.map(like => like.dataValues.userId).includes(Number(userId)),
		reviews: post.dataValues.PostReviews.length,
		rating: post.dataValues.PostReviews.length > 0 ? Math.round(post.dataValues.PostReviews.reduce((acc, cur) => acc + cur.dataValues.rating * 2, 0) / post.dataValues.PostReviews.length) / 2 : 0,
	};
}


async function findPosts(searcherId, options) {
	const fullOptions = {
		...options,
		include: [{ model: Recipe }, { model: User }, { model: PostLike }, { model: PostReview }],
	};
	const postsRaw = await Post.findAll(fullOptions).catch(err => {
		console.log(err);
		return [];
	});
	if (!postsRaw) return [];

	const posts = postsRaw.map(post => {
		return {
			id: post.dataValues.id,
			user: {
				id: post.dataValues.User.dataValues.id,
				username: post.dataValues.User.dataValues.username,
			},
			recipe: {
				id: post.dataValues.Recipe.dataValues.id,
				title: post.dataValues.Recipe.dataValues.title,
				ingredients: post.dataValues.Recipe.dataValues.ingredients,
				directions: post.dataValues.Recipe.dataValues.directions,
			},
			caption: post.dataValues.caption,
			category: post.dataValues.category,
			likes: post.dataValues.PostLikes.length,
			liked: post.dataValues.PostLikes.map(like => like.dataValues.userId).includes(Number(searcherId)),
			reviews: post.dataValues.PostReviews.length,
			rating: post.dataValues.PostReviews.length > 0 ? Math.round(post.dataValues.PostReviews.reduce((acc, cur) => acc + cur.dataValues.rating * 2, 0) / post.dataValues.PostReviews.length) / 2 : 0,
		};
	});

	return posts;
}

async function findHotPosts(userId) {
	const likes = await PostLike.findAll({
		where: { createdAt: { [Op.gt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
		attributes: [[PostLike.sequelize.fn("COUNT", PostLike.sequelize.col("postId")), "count"]],
		group: [col("Post.id")],
		order: [[PostLike.sequelize.fn("COUNT", col("Post.id")), "DESC"]],
		limit: 20,
		include: [{ model: Post }],
	}).catch(err => {
		console.log(err);
		return null;
	});
	if (!likes) return null;

	const posts = likes.map(like => like.dataValues.Post.dataValues);

	const formattedPosts = await Promise.all(posts.map(async postLean => {
		const post = await findPostById(postLean.id, userId);
		return post;
	}));

	return formattedPosts.filter(post => post !== null);
}

async function findNewPosts(userId) {
	return await findPosts(userId, {
		order: [["createdAt", "DESC"]],
		limit: 20,
	});
}

async function findCuratedPosts(userId) {
	// Get 20 random posts from the last 100 posts
	return await findPosts(userId, {
		order: [["createdAt", "DESC"]],
		limit: 100,
	});
}

async function findBreakfastPosts(userId) {
	return await findPosts(userId, {
		where: { category: "Breakfast" },
		order: [["createdAt", "DESC"]],
		limit: 20,
	});
}

async function findLunchPosts(userId) {
	return await findPosts(userId, {
		where: { category: "Lunch" },
		order: [["createdAt", "DESC"]],
		limit: 20,
	});
}

async function findDinnerPosts(userId) {
	return await findPosts(userId, {
		where: { category: "Dinner" },
		order: [["createdAt", "DESC"]],
		limit: 20,
	});
}

async function findDessertPosts(userId) {
	return await findPosts(userId, {
		where: { category: "Dessert" },
		order: [["createdAt", "DESC"]],
		limit: 20,
	});
}

router.get("/", authenticateToken, async (req, res) => {
	const { userId } = req.body;
	const [
		hot,
		newPosts,
		curated,
		breakfast,
		lunch,
		dinner,
		dessert,
	] = await Promise.all([
		findHotPosts(userId).catch(() => []),
		findNewPosts(userId).catch(() => []),
		findCuratedPosts(userId).catch(() => []),
		findBreakfastPosts(userId).catch(() => []),
		findLunchPosts(userId).catch(() => []),
		findDinnerPosts(userId).catch(() => []),
		findDessertPosts(userId).catch(() => []),
	]);

	const data = {
		hot,
		new: newPosts,
		curated,
		breakfast,
		lunch,
		dinner,
		dessert,
	};

	res.send(data);
});

export default router;
