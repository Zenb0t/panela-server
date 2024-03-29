import { Ingredient } from "../types/ingredient";
import { DatabaseError } from "../utils/errors";
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
	} catch (err) {
		throw err as DatabaseError;
	}
};

/***
 * Get all ingredients
 * @returns {Promise<Object>} All ingredients data.
 * @throws {Error} Throws an error if the ingredients cannot be found.
 */
export const getAllIngredients = async () => {
	try {
		const ingredients = await IngredientModel.find();
		return ingredients;
	} catch (err) {
		throw err as DatabaseError;
	}
};

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
	} catch (err) {
		throw err as DatabaseError;
	}
};

/***
 * Update ingredient by id
 * @param {string} id - The id of the ingredient to update.
 * @param {Ingredient} ingredientData - Data for updating an ingredient.
 * @returns {Promise<Object>} The updated ingredient data.
 * @throws {Error} Throws an error if the ingredient cannot be updated.
 */
export const updateIngredient = async (
	id: string,
	ingredientData: Ingredient
) => {
	try {
		const ingredient = await IngredientModel.findOneAndUpdate(
			{ id: id },
			ingredientData,
			{ new: true }
		);
		if (!ingredient) {
			throw new Error("Ingredient not found");
		}
		return ingredient;
	} catch (err) {
		throw err as DatabaseError;
	}
};

/***
 * Delete ingredient by id
 * @param {string} id - The id of the ingredient to delete.
 * @returns {Promise<Object>} The deleted ingredient data.
 * @throws {Error} Throws an error if the ingredient cannot be deleted.
 */
export const deleteIngredient = async (id: string) => {
	try {
		const result = await IngredientModel.deleteOne({ id: id });
		if (result.deletedCount === 0) {
			throw new Error("Ingredient not found");
		}
		return result;
	} catch (err) {
		throw err as DatabaseError;
	}
};
