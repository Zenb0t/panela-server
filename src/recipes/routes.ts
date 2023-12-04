import { Router } from "express";
import {
	createNewRecipe,
	deleteRecipeById,
	serializeAllRecipes,
	serializeAllRecipesByUser,
	serializeRecipeById,
	updateRecipeById,
	validadeRecipeId,
	validateRecipe,
} from "./middleware";

const recipeRouter = Router({ mergeParams: true });

recipeRouter.post("/recipes", validateRecipe, createNewRecipe);
recipeRouter.get("/recipes", serializeAllRecipes);
recipeRouter.get("/recipes/all", serializeAllRecipesByUser);
recipeRouter.get("/recipes/:id", serializeRecipeById);
recipeRouter.put("/recipes/:id", validateRecipe, updateRecipeById);
recipeRouter.delete("/recipes/:id", validadeRecipeId, deleteRecipeById);

export default recipeRouter;
