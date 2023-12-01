import { RecipeModel } from "./model";
import { Recipe } from "../types/recipe";
import { ErrorMessages as e } from "../consts";

/***
 * Creates a new recipe
 * @param {Recipe} recipeData - Data for creating a new recipe.
 * @returns {Promise<Object>} The created recipe data.
 * @throws {Error} Throws an error if the recipe cannot be saved.
 */
export const createRecipe = async (recipeData: Recipe) => {
  try {
    const recipe = new RecipeModel(recipeData);
    const savedRecipe = await recipe.save();
    return savedRecipe;
  } catch (err) {
    throw err;
  }
};

/***
 * Get all recipes
 * @returns {Promise<Object>} All recipes data.
 * @throws {Error} Throws an error if the recipes cannot be found.
 */
export const getAllRecipes = async () => {
  try {
    const recipes = await RecipeModel.find();
    return recipes;
  } catch (err) {
    throw err;
  }
};

/***
 * Get all recipes by userId
 * @param {string} userId - The id of the user to get.
 * @returns {Promise<Object>} All recipes data.
 * @throws {Error} Throws an error if the recipes cannot be found.
 */
export const getAllRecipesByUserId = async (userId: string) => {
  try {
    const recipes = await RecipeModel.find({ ownerId: userId });
    return recipes;
  } catch (err) {
    throw err;
  }
};

/***
 * Get a recipe by id
 * @param {string} id - The id of the recipe to get.
 * @returns {Promise<Object>} The recipe data.
 * @throws {Error} Throws an error if the recipe cannot be found.
 */
export const getRecipeById = async (id: string) => {
  try {
    const recipe = await RecipeModel.findOne({ _id: id });
    if (!recipe) {
      throw new Error(e.RECIPE_NOT_FOUND_ERROR);
    }
    return recipe;
  } catch (err) {
    throw err;
  }
};

/***
 * Update a recipe by id
 * @param {string} id - The id of the recipe to update.
 * @param {Recipe} recipeData - The data to update the recipe with.
 * @returns {Promise<Object>} The updated recipe data.
 * @throws {Error} Throws an error if the recipe cannot be updated.
 */
export const updateRecipe = async (id: string, recipeData: Recipe) => {
  try {
    const recipe = await RecipeModel.findOneAndUpdate({ _id: id }, recipeData, {
      new: true,
    });
    if (!recipe) {
      throw new Error(e.RECIPE_NOT_FOUND_ERROR);
    }
    return recipe;
  } catch (err) {
    throw err;
  }
};

/***
 * Delete a recipe by id
 * @param {string} id - The id of the recipe to delete.
 * @returns {Promise<Object>} The deleted recipe data.
 * @throws {Error} Throws an error if the recipe cannot be deleted.
 */
export const deleteRecipe = async (id: string) => {
  try {
    const result = await RecipeModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error(e.RECIPE_NOT_FOUND_ERROR);
    }
    return result;
  } catch (err) {
    throw err;
  }
};
