import { RequestHandler } from "express";
import { UserModel } from "./model";
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserProfile,
  deleteUser,
} from "./dao";
import { handleError } from "../utils/errorHandler";
import { ErrorMessages as e } from "../consts";
import logger from "../utils/logger";
import { Role, ZodUserSchema } from "../types/user";
import { isRoleValid } from "../utils/validation";
import { ZodError } from "zod";

/***
 * Validate the user data sent in the request body
 */
export const validateUserData: RequestHandler = async (req, res, next) => {
  const { role, user } = req.body;
  if (!role) {
    req.body.role = Role.USER;
  }
  logger.info(`Validating user data'`);
  try {
    const result = ZodUserSchema.safeParse(req.body);
    if (!result.success) {
      const error = result.error as ZodError;
      return res.status(400).send({ message: error.message });
    }
    // isRoleValid(role);
    if (user && user.role !== role) {
      return res.status(400).send({ message: e.ROLE_CHANGE_NOT_ALLOWED_ERROR });
    }
    logger.info(`User data validated`);
    next();
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

/***
 * Check if the user does not exist in the database.
 * If the user exists, return an error.
 */
export const checkUserDoesNotExist: RequestHandler = async (req, res, next) => {
  logger.info(`Checking if user ${req.body.email} exists`);
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ message: e.USER_ALREADY_EXISTS_ERROR });
    }
    next();
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

/***
 * Check if the user exists in the database.
 * If the user does not exist, return an error.
 */
export const checkUserExists: RequestHandler = async (req, res, next) => {
  const { id, email } = req.params;
  if (id) {
    logger.info(`Checking if user with id ${id} exists`);
  } else if (email) {
    logger.info(`Checking if user with email ${email} exists`);
  }

  if (!email && !id) {
    return res
      .status(400)
      .send({ message: e.PARAM_EMAIL_OR_ID_REQUIRED_ERROR });
  }
  try {
    // Check for id first, then email
    let filterParam = id ? { id: id } : { email: email };

    const user = await UserModel.findOne(filterParam);
    if (!user) {
      return res.status(404).send({ message: e.USER_NOT_FOUND_ERROR });
    }
    req.body.user = user;
    next();
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};

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
