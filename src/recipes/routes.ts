import { Router, RequestHandler } from "express";
import { createNewRecipe, deleteRecipeById, serializeAllRecipes, serializeAllRecipesByUser, serializeRecipeById, updateRecipeById, validateRecipe } from "./middleware";

const recipeRouter = Router({ mergeParams: true });

recipeRouter.post("/recipes", validateRecipe, createNewRecipe);
recipeRouter.get("/recipes", serializeAllRecipes);
recipeRouter.get("/recipes/all", serializeAllRecipesByUser);
recipeRouter.get("/recipes/:id", serializeRecipeById);
recipeRouter.put("/recipes/:id", validateRecipe, updateRecipeById);
recipeRouter.delete("/recipes/:id", deleteRecipeById);

export default recipeRouter;
