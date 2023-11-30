import mongoose from "mongoose";
import { IngredientSchema } from "../models/ingredient";
import { Recipe } from "../types/recipe";

const IngredientItemSchema = new mongoose.Schema({
  ingredient: IngredientSchema,
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

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
  ingredients: [IngredientItemSchema],
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
});

export const RecipeModel = mongoose.model("Recipe", RecipeSchema);