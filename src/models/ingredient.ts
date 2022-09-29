import mongoose from 'mongoose';

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    cost: number;
}

export const IngredientSchema = new mongoose.Schema<Ingredient>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            // required: true,
        },
        unit: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true,
            default: 0,
        },
    });

export const IngredientModel = mongoose.model<Ingredient>("Ingredient", IngredientSchema);
