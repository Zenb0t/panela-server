import mongoose from 'mongoose';
import { Ingredient } from 'src/types/ingredient';

export const IngredientSchema = new mongoose.Schema<Ingredient>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
        },
        measuringUnit: {
            type: String,
            required: true
        },
        costPerUnit: {
            type: Number,
            required: true,
            trim: true
        },
        id: {
            type: String,
            default: mongoose.Types.ObjectId.toString(),
            trim: true
        }
    });

export const IngredientModel = mongoose.model<Ingredient>("Ingredient", IngredientSchema);
