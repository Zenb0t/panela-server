import { Ingredient, ZodIngredientSchema } from "./ingredient";
import { z } from "zod";

export interface Recipe {
	_id?: string;
	title: string;
	description: string;
	totalTimeInMinutes: number;
	prepTimeInMinutes?: number;
	cookTimeInMinutes?: number;
	cost?: number;
	ingredients: IngredientItem[];
	instructions: string[];
	imageUrl: string;
	ownerId: string;
	sourceUrl?: string;
	servings?: number;
	author?: string;
	recipeCuisine?: string;
	recipeCategory?: string;
	keywords?: string[];
	aggregateRating?: AggregateRating;
}

export interface AggregateRating {
	ratingValue: number;
	ratingCount: number;
	reviewCount: number;
}

export interface Meta {}

export interface NutritionalInfo {
	calories?: number;
	fatContent?: number;
	cholesterolContent?: number;
	sodiumContent?: number;
	carbohydrateContent?: number;
	fiberContent?: number;
	sugarContent?: number;
	proteinContent?: number;
	saturatedFatContent?: number;
	transFatContent?: number;
	unsaturatedFatContent?: number;
}

export interface IngredientItem {
	ingredient: Ingredient;
	quantity: number;
	measuringUnit: string;
}

export const ZodRecipeSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	totalTimeInMinutes: z
		.number()
		.min(1, "Total time must be a positive number"),
	cost: z.number().optional(),
	ingredients: z.array(ZodIngredientSchema),
	instructions: z.array(z.string()),
	imageUrl: z.string().url().optional(),
	ownerId: z.string().min(1, "Owner ID is required"),
	sourceUrl: z.string().url().optional().or(z.literal("")),
});
