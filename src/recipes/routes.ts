import { Router, RequestHandler } from "express";

const recipeRouter = Router({ mergeParams: true });

recipeRouter.post("/recipes", create);
recipeRouter.get("/recipes", findAll);
recipeRouter.get("/recipes/all", findAllRecipesByUserId);
recipeRouter.get("/recipes/:id", findOne);
recipeRouter.delete("/recipes/:id", remove);
recipeRouter.put("/recipes/:id", updateRecipe);
