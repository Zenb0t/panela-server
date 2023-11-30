import { Router, RequestHandler } from "express";
import { createNewRecipe, deleteRecipeById, serializeAllRecipes, serializeAllRecipesByUser, serializeRecipeById, updateRecipeById } from "./middleware";

const recipeRouter = Router({ mergeParams: true });

recipeRouter.post("/recipes", createNewRecipe);
recipeRouter.get("/recipes", serializeAllRecipes);
recipeRouter.get("/recipes/all", serializeAllRecipesByUser);
recipeRouter.get("/recipes/:id", serializeRecipeById);
recipeRouter.put("/recipes/:id", updateRecipeById);
recipeRouter.delete("/recipes/:id", deleteRecipeById);

export default recipeRouter;
