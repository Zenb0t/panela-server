import { Router } from "express";
import { validadeRecipeId, validateRecipe } from "./middleware";
import {
	createNewRecipe,
	deleteRecipeById,
	serializeAllRecipes,
	serializeAllRecipesByUser,
	serializeRecipeById,
	updateRecipeById,
} from "./controller";

const recipeRouter = Router({ mergeParams: true });

recipeRouter.post("/recipes", validateRecipe, createNewRecipe);
recipeRouter.get("/recipes", serializeAllRecipes);
recipeRouter.get("/recipes/all", serializeAllRecipesByUser);
recipeRouter.get("/recipes/:id", serializeRecipeById);
recipeRouter.put("/recipes/:id", validateRecipe, updateRecipeById);
recipeRouter.delete("/recipes/:id", validadeRecipeId, deleteRecipeById);

export default recipeRouter;
