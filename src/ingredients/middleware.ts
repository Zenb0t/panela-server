import { RequestHandler } from "express";
import logger from "../utils/logger";
import { handleError } from "../utils/errorHandler";
import { getAllIngredients, getIngredientById } from "./dao";


export const createNewIngredient: RequestHandler = async (req, res, next) => {
    logger.info(`Creating ingredient ${req.body.name}`);
    try {
        const ingredient = await createIngredient(req.body);
        logger.info(`Ingredient ${req.body.name} created`);
        logger.debug(ingredient);
        res.status(201).send(ingredient);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
}

export const serializeAllIngredients: RequestHandler = async (req, res, next) => {
    logger.info(`Serializing all ingredients`);
    try {
        const ingredients = await getAllIngredients();
        logger.info(`Ingredients serialized`);
        logger.debug(ingredients);
        res.status(200).send(ingredients);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
}

export const serializeIngredientById: RequestHandler = async (req, res, next) => {
    logger.info(`Serializing ingredient ${req.params.id}`);
    try {
        const ingredient = await getIngredientById(req.params.id);
        logger.info(`Ingredient serialized`);
        logger.debug(ingredient);
        res.status(200).send(ingredient);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
}