import { Ingredient, ZodIngredientSchema } from "./ingredient";
import { z } from "zod";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  totalTimeInMinutes: number;
  cost?: number;
  ingredients: IngredientItem[];
  instructions: string[];
  imageUrl: string;
  ownerId: string;
  sourceUrl?: string;
}

export interface IngredientItem {
  ingredient: Ingredient;
  quantity: number;
  unit: string;
}

export const IngredientItemSchema = z.object({
  ingredient: ZodIngredientSchema,
  quantity: z.number().min(1, "Quantity must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
});

export const ZodRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  totalTimeInMinutes: z.number().min(1, "Total time must be a positive number"),
  cost: z.number().optional(),
  ingredients: z.array(IngredientItemSchema),
  instructions: z.array(z.string()),
  imageUrl: z.string().url().optional(),
  ownerId: z.string().min(1, "Owner ID is required"),
  sourceUrl: z.string().url().optional(),
});
