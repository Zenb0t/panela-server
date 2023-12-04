import { RequestHandler } from "express";
import logger from "../utils/logger";
import { handleError } from "../utils/errorHandler";
import { ZodIngredientSchema } from "../types/ingredient";

export const validateIngredient: RequestHandler = async (req, res, next) => {
	logger.info(`Validating ingredient ${req.body.name}`);
	try {
		ZodIngredientSchema.parse(req.body);
		logger.info(`Ingredient ${req.body.name} validated`);
		next();
	} catch (err: any) {
		handleError(err, req, res, next);
	}
};
