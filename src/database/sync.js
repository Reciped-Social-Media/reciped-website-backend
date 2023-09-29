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

async function sync(alter = false) {
	await User.sync({ alter });
	await Recipe.sync({ alter });
	await Ingredient.sync({ alter });
	await RecipeIngredient.sync({ alter });
	await UserRecipe.sync({ alter });
	await UserIngredient.sync({ alter });
	await Post.sync({ alter });
	await PostLike.sync({ alter });
	await PostReview.sync({ alter });
	await Session.sync({ alter });
	await SessionRefreshToken.sync({ alter });
	await UserMealPlan.sync({ alter });
	await UserShopList.sync({ alter });
}

sync(true);