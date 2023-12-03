import logger from "../utils/logger";
import {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserProfile,
    deleteUser,
} from "./dao";
import { handleError } from "../utils/errorHandler";
import { ErrorMessages as e } from "../consts";
import { RequestHandler } from "express-serve-static-core";

/***
 * Create a new user in the database
 */
export const createNewUser: RequestHandler = async (req, res, next) => {
    logger.info(`Creating new user ${req.body.email}`);
    try {
        const user = await createUser(req.body.user);
        logger.info(`User ${req.body.email} created`);
        logger.debug(user);
        res.status(201).send(user);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
};

/***
 * Get a user by id
 */
export const serializeUserById: RequestHandler = async (req, res, next) => {
    logger.info(`Serializing user ${req.params}`);
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: e.USER_NOT_FOUND_ERROR });
        }
        res.status(200).send(user);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
};

/***
 * Get a user by email
 */
export const serializeUserByEmail: RequestHandler = async (req, res, next) => {
    // check the path params for the email
    logger.info(`Serializing user ${req.params.email}`);

    try {
        const user = await getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).send({ message: e.USER_NOT_FOUND_ERROR });
        }
        res.status(200).send(user);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
};

/***
 * Update a user by id
 */
export const updateUserById: RequestHandler = async (req, res, next) => {
    logger.info(`Updating user ${req.params.id}`);
    try {
        const user = await updateUserProfile(req.params.id, req.body);
        if (!user) {
            return res.status(404).send({ message: e.USER_NOT_FOUND_ERROR });
        }
        res.status(200).send(user);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
};

/***
 * Delete a user by id
 */
export const deleteUserById: RequestHandler = async (req, res, next) => {
    logger.info(`Deleting user ${req.params.id}`);
    try {
        const result = await deleteUser(req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: e.USER_NOT_DELETED_ERROR });
        }
        res.status(200).send(result);
    } catch (err: any) {
        handleError(err, req, res, next);
    }
};
