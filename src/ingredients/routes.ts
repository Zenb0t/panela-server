import { Router } from "express";
import {
	createNewIngredient,
	deleteIngredientById,
	serializeAllIngredients,
	serializeIngredientById,
	updateIngredientById,
} from "./controller";
import { validateIngredient } from "./middleware";

const ingredientRouter = Router({ mergeParams: true });

ingredientRouter.post("/ingredients", validateIngredient, createNewIngredient);
ingredientRouter.get("/ingredients", serializeAllIngredients);
ingredientRouter.get("/ingredients/:id", serializeIngredientById);
ingredientRouter.put("/ingredients/:id", updateIngredientById);
ingredientRouter.delete("/ingredients/:id", deleteIngredientById);

export default ingredientRouter;
