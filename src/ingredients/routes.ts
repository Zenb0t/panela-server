import { Router } from "express";
import {
  createNewIngredient,
  deleteIngredientById,
  serializeAllIngredients,
  serializeIngredientById,
  updateIngredientById,
} from "./middleware";

const ingredientRouter = Router({ mergeParams: true });

ingredientRouter.post("/ingredients", createNewIngredient);
ingredientRouter.get("/ingredients", serializeAllIngredients);
ingredientRouter.get("/ingredients/:id", serializeIngredientById);
ingredientRouter.put("/ingredients/:id", updateIngredientById);
ingredientRouter.delete("/ingredients/:id", deleteIngredientById);

export default ingredientRouter;
