import mongoose from "mongoose";
import { Ingredient } from "../types/ingredient";

export const IngredientSchema = new mongoose.Schema<Ingredient>({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	measuringUnit: {
		type: String,
		required: true,
	},
	costPerUnit: {
		type: Number,
		required: true,
		trim: true,
	},
});

export const IngredientModel = mongoose.model<Ingredient>(
	"Ingredient",
	IngredientSchema,
);
