import { Ingredient } from "../types/ingredient";
import { IngredientModel } from "./model";

/**
 * Creates a new ingredient
 * @param {Ingredient} ingredientData - Data for creating a new ingredient.
 * @returns {Promise<Object>} The created ingredient data.
 * @throws {Error} Throws an error if the ingredient cannot be saved.
 */
export const createIngredient = async (ingredientData: Ingredient) => {
    try {
        const ingredient = new IngredientModel(ingredientData);
        const savedIngredient = await ingredient.save();
        return savedIngredient;
    }
    catch (err) {
        throw err;
    }
}

/***
 * Get all ingredients
 * @returns {Promise<Object>} All ingredients data.
 * @throws {Error} Throws an error if the ingredients cannot be found.
 */
export const getAllIngredients = async () => {
    try {
        const ingredients = await IngredientModel.find();
        return ingredients;
    }
    catch (err) {
        throw err;
    }
}

/***
 * Get ingredient by id
 * @param {string} id - The id of the ingredient to get.
 * @returns {Promise<Object>} The ingredient data.
 * @throws {Error} Throws an error if the ingredient cannot be found.
 * 
    */
export const getIngredientById = async (id: string) => {
    try {
        const ingredient = await IngredientModel.findOne({ id: id });
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }
        return ingredient;
    }
    catch (err) {
        throw err;
    }
};


