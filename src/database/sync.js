import {
	User,
	Recipe,
	Ingredient,
	RecipeIngredient,
	UserRecipe,
	UserIngredient,
	Post,
	PostLike,
	PostReview,
	Session,
	SessionRefreshToken,
	UserMealPlan,
	UserShopList,
} from "./associations.js";

async function sync() {
	await User.sync();
	await Recipe.sync();
	await Ingredient.sync();
	await RecipeIngredient.sync();
	await UserRecipe.sync();
	await UserIngredient.sync();
	await Post.sync();
	await PostLike.sync();
	await PostReview.sync();
	await Session.sync();
	await SessionRefreshToken.sync();
	await UserMealPlan.sync();
	await UserShopList.sync();
}

sync({ alter: true });