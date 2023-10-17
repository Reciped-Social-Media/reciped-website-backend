import {
	Ingredient,
	Post,
	PostLike,
	PostReview,
	Recipe,
	RecipeIngredient,
	Session,
	SessionRefreshToken,
	User,
	UserIngredient,
	UserMealPlan,
	UserRecipe,
	UserShopList,
	Embedding,
} from "./models/index.js";

// Recipe associations
Recipe.hasMany(RecipeIngredient, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
RecipeIngredient.belongsTo(Recipe, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

Recipe.hasMany(Post, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Post.belongsTo(Recipe, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

Recipe.hasMany(UserMealPlan, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
UserMealPlan.belongsTo(Recipe, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

Recipe.hasMany(UserRecipe, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
UserRecipe.belongsTo(Recipe, {
	foreignKey: "recipeId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

// User associations
User.hasMany(UserMealPlan, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
UserMealPlan.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(UserIngredient, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
UserIngredient.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(UserRecipe, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
UserRecipe.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(UserShopList, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
UserShopList.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(Post, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Post.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(PostLike, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
PostLike.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(PostReview, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
PostReview.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasOne(Session, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Session.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

// Session associations
Session.hasMany(SessionRefreshToken, {
	foreignKey: "sessionId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
SessionRefreshToken.belongsTo(Session, {
	foreignKey: "sessionId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

// Post associations
Post.hasMany(PostLike, {
	foreignKey: "postId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
PostLike.belongsTo(Post, {
	foreignKey: "postId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

Post.hasMany(PostReview, {
	foreignKey: "postId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
PostReview.belongsTo(Post, {
	foreignKey: "postId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

// Ingredient associations
Ingredient.hasMany(UserIngredient, {
	foreignKey: "ingredientId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
UserIngredient.belongsTo(Ingredient, {
	foreignKey: "ingredientId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

export {
	Ingredient,
	Post,
	PostLike,
	PostReview,
	Recipe,
	RecipeIngredient,
	Session,
	SessionRefreshToken,
	User,
	UserIngredient,
	UserMealPlan,
	UserRecipe,
	UserShopList,
	Embedding,
};

