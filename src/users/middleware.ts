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

/***
 * Validate the user data sent in the request body
 */
export const validateUser: RequestHandler = async (req, res, next) => {
  const { email, name, role } = req.body;
  logger.info(`Validating user ${email}`);

  // TODO: Extract all validation logic to a separate functions
  // Check if the user format is correct
  if (!email || !name) {
    res.status(400).send({
      message: e.INCOMPLETE_USER_DATA_ERROR,
    });
    return;
  }
  // Validate the email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    res.status(400).send({ message: e.EMAIL_FORMAT_ERROR });
    return;
  }
  // Check if the 'role' field is being updated to an unauthorized value
  if (role && role !== "user") {
    return res.status(400).send({ message: e.ROLE_CHANGE_NOT_ALLOWED_ERROR });
  }

  // If everything is OK, continue
  next();
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
    req.body.user = user; // Attach the user to the request object
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
    const user = await createUser(req.body);
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
    const user = await deleteUser(req.params.id);
    if (!user) {
      return res.status(404).send({ message: e.USER_NOT_DELETED_ERROR });
    }
    res.status(200).send(user);
  } catch (err: any) {
    handleError(err, req, res, next);
  }
};
