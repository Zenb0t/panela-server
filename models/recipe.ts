import mongoose from 'mongoose';
import { Ingredient, IngredientModel } from './ingredient';

interface Recipe extends mongoose.Document {
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
    imageUrl: string;
    favorite: boolean;
    id: string;
}


const RecipeSchema = new mongoose.Schema<Recipe>({
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
    ingredients: {
        type: [{name: String, amount: String}],
        required: true,
    },
    instructions: {
        type: [String],
        required: true,
    },
    imageUrl: {
        type: String
    },
    favorite: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        default: mongoose.Types.ObjectId.toString(),
        trim: true
    }

});

export const Recipe = mongoose.model("Recipe", RecipeSchema);