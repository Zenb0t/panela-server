import mongoose from 'mongoose';
import { Ingredient, IngredientSchema } from './ingredient';

interface Recipe extends mongoose.Document {
    title: string;
    description: string;
    totalTime: string; //TODO: change to time?
    cost: number;
    ingredients: [{ ingredient: Ingredient, quantity: number, unit: string }]; //TODO: check if is unit or cost here.
    instructions: string[];
    imageUrl: string;
    favorite: boolean;
    id: string;
}

interface Time extends mongoose.Document {
    hours: number;
    minutes: number;
}

const TimeSchema = new mongoose.Schema({
    hours: Number,
    minutes: Number
});


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
    totalTime: TimeSchema,
    cost: {
        type: Number,
        required: true,
        trim: true
    },
    ingredients: {
        type: [{ ingredient: IngredientSchema, quantity: Number, cost: Number }],
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