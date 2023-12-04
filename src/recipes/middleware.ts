import { RequestHandler } from "express";
import logger from "../utils/logger";
import { handleError } from "../utils/errorHandler";
import { ZodRecipeSchema } from "../types/recipe";
import { validateId } from "../utils/validation";

/***
 * Validate the recipe data sent in the request body
 */
export const validateRecipe: RequestHandler = async (req, res, next) => {
  logger.info(`Validating recipe ${req.body.title}`);
  try {
    ZodRecipeSchema.parse(req.body);
    logger.info(`Recipe ${req.body.title} validated`);
    next();
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

export const validadeRecipeId: RequestHandler = async (req, res, next) => {
  logger.info(`Validating recipe ${req.params.id}`);
  try {
    validateId(req.params.id);
    logger.info(`Recipe ${req.params.id} validated`);
    next();
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};
