import mongoose from "mongoose";
import { IngredientSchema } from "../ingredients/model";
import { Recipe } from "../types/recipe";

const RecipeSchema = new mongoose.Schema<Recipe>({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	totalTimeInMinutes: {
		type: Number,
		required: true,
	},
	cost: {
		type: Number,
	},
	ingredients: [IngredientSchema],
	instructions: {
		type: [String],
		required: true,
	},
	imageUrl: {
		type: String,
	},
	ownerId: {
		type: String,
		required: true,
		trim: true,
	},
	sourceUrl: {
		type: String,
	},
	servings: {
		type: Number,
	},
});

export const RecipeModel = mongoose.model("Recipe", RecipeSchema);
