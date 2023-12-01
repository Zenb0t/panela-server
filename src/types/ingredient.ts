import { z } from "zod";
export interface Ingredient {
  _id?: string;
  name: string;
  measuringUnit: MeasuringUnit;
  amount: number; // Quantity of the ingredient
  costPerUnit?: number; // Cost per unit of measurement
}

export const ZodIngredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  measuringUnit: z.string().min(1, "Measuring unit is required"),
  amount: z.number().min(1, "Amount must be a positive number"),
  costPerUnit: z.number().optional(),
});

export enum MeasuringUnit {
  GRAM = "gram",
  OUNCE = "ounce",
  CUP = "cup",
  TABLESPOON = "tablespoon",
  TEASPOON = "teaspoon",
  PIECE = "piece",
}
