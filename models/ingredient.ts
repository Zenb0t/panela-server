import mongoose from 'mongoose';

export interface Ingredient {
    uuid: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
}

const IngredientSchema = new mongoose.Schema<Ingredient>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
    });

export const IngredientModel = mongoose.model<Ingredient>("Ingredient", IngredientSchema);
