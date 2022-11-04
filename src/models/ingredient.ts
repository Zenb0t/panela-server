import mongoose from 'mongoose';

export interface Ingredient {
    name: string;
    amount: number;
    measuringUnit: string;
    cost: number;
    unitCost: number;
    id: string;
}

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
        cost: {
            type: Number,
            required: true,
            default: 0,
        },
        unitCost: {
            type: Number,
            required: true,
            default: function () {
                return this.cost / this.amount;
            }
        },
        id: {
            type: String,
            default: mongoose.Types.ObjectId.toString(),
            trim: true
        }
    });

export const Ingredient = mongoose.model<Ingredient>("Ingredient", IngredientSchema);
