import { Router } from "express";

const ingredientRouter = Router({ mergeParams: true});

ingredientRouter.post("/ingredients", createIngredient);
ingredientRouter.get("/ingredients", getAll);
ingredientRouter.get("/ingredients/:id", getOne);
ingredientRouter.put("/ingredients/:id", update);
ingredientRouter.delete("/ingredients/:id", deleteOne);

export default ingredientRouter;