import { z } from 'zod';
export interface Ingredient {
    id: string;
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

  export type MeasuringUnit = 'gram' | 'ounce' | 'cup' | 'tablespoon' | 'teaspoon' | 'piece';