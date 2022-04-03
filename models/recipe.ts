import mongoose from 'mongoose';
import { Ingredient, IngredientModel } from './ingredient';

interface Recipe extends mongoose.Document {
    uuid: string;
    title: string;
    description: string;
    // ingredients: Ingredient[];
    imagePath: string;
}


const RecipeSchema = new mongoose.Schema<Recipe>({
    uuid: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    // ingredients: {
    //     type: [IngredientModel],
    //     required: true,
    //     trim: true
    // },
    imagePath: {
        type: String
    }
});

export const Recipe = mongoose.model("Recipe", RecipeSchema);