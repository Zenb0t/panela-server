import { RequestHandler } from "express";
import logger from "../utils/logger";
import { handleError } from "../utils/errorHandler";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getAllRecipesByUserId,
  getRecipeById,
  updateRecipe,
} from "./dao";
import { ErrorMessages as e } from "../consts";
import { ZodRecipeSchema } from "../types/recipe";

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

export const createNewRecipe: RequestHandler = async (req, res, next) => {
  logger.info(`Creating recipe ${req.body.title}`);
  try {
    const recipe = await createRecipe(req.body);
    logger.info(`Recipe ${req.body.title} created`);
    logger.debug(recipe);
    res.status(201).send(recipe);
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

export const serializeAllRecipes: RequestHandler = async (req, res, next) => {
  logger.info(`Serializing all recipes`);
  try {
    const recipes = await getAllRecipes();
    logger.info(`Recipes serialized`);
    logger.debug(recipes);
    res.status(200).send(recipes);
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

export const serializeAllRecipesByUser: RequestHandler = async (
  req,
  res,
  next
) => {
  logger.info(`Serializing all recipes for user ${req.params.userId}`);
  try {
    const recipes = await getAllRecipesByUserId(req.params.userId);
    logger.info(`Recipes serialized`);
    logger.debug(recipes);
    res.status(200).send(recipes);
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

export const serializeRecipeById: RequestHandler = async (req, res, next) => {
  logger.info(`Serializing recipe ${req.params.id}`);
  try {
    const recipe = await getRecipeById(req.params.id);
    logger.info(`Recipe serialized`);
    logger.debug(recipe);
    res.status(200).send(recipe);
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

export const updateRecipeById: RequestHandler = async (req, res, next) => {
  logger.info(`Updating recipe ${req.params.id}`);
  try {
    const recipe = await updateRecipe(req.params.id, req.body);
    if (!recipe) {
      return res.status(404).send({ message: e.RECIPE_NOT_FOUND_ERROR });
    }
    res.status(200).send(recipe);
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

export const deleteRecipeById: RequestHandler = async (req, res, next) => {
  logger.info(`Deleting recipe ${req.params.id}`);
  try {
    const recipe = await deleteRecipe(req.params.id);
    if (!recipe) {
      return res.status(404).send({ message: e.RECIPE_NOT_FOUND_ERROR });
    }
    res.status(200).send(recipe);
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};
