import { RequestHandler } from "express";
import { UserModel } from "./model";
// import { handleError } from "src/utils/errorHandler";
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserProfile,
} from "./dao";
import { USER_VALID_FIELDS } from "../consts";

function handleError(err: any, req: any, res: any) {
  console.error("An error occurred");
  console.error(err.name);
  console.error(err.message);
}

/***
 * Validate the user data sent in the request body
 */
export const validateUser: RequestHandler = async (req, res, next) => {
  const { email, name, role } = req.body;
  console.info(`Validating user ${email}`);

  // TODO: Extract all validation logic to a separate functions
  // Check if the user format is correct
  if (!email || !name) {
    res.status(400).send({
      message: "User data is incomplete. Email and name are required.",
    });
    return;
  }
  // Validate the email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    res.status(400).send({ message: "Email format is invalid." });
    return;
  }
  // Check if the 'role' field is being updated to an unauthorized value
  if (role && role !== "user") {
    return res
      .status(400)
      .send({ message: "Changing role not allowed." });
  }

  // If everything is OK, continue
  next();
};

/***
 * Check if the user does not exist in the database.
 * If the user exists, return an error.
 */
export const checkUserDoesNotExist: RequestHandler = async (req, res, next) => {
  console.info(`Checking if user ${req.body.email} exists`);
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .send({ message: `User with email ${user.email} already exists` });
    }
    next();
  } catch (err: any) {
    handleError(err, req, res);
  }
};

/***
 * Check if the user exists in the database.
 * If the user does not exist, return an error.
 */
export const checkUserExists: RequestHandler = async (req, res, next) => {
  const { id, email } = req.params;
  if (id) {
    console.info(`Checking if user with id ${id} exists`);
  } else if (email) {
    console.info(`Checking if user with email ${email} exists`);
  }

  if (!email && !id) {
    return res
      .status(400)
      .send({ message: "Parameter email or id is required" });
  }
  try {
    // Check for id first, then email
    let filterParam = id ? { id: id } : { email: email };

    const user = await UserModel.findOne(filterParam);
    if (!user) {
      return res.status(404).send({ message: `User not found` });
    }
    req.body.user = user; // Attach the user to the request object
    next();
  } catch (err: any) {
    handleError(err, req, res);
  }
};

/***
 * Create a new user in the database
 */
export const createNewUser: RequestHandler = async (req, res) => {
  console.info(`Creating new user ${req.body.email}`);
  try {
    const user = await createUser(req.body);
    console.info(`User ${req.body.email} created`);
    console.debug(user);
    res.status(201).send(user);
  } catch (err: any) {
    handleError(err, req, res);
  }
};

/***
 * Get a user by id
 */
export const serializeUserById: RequestHandler = async (req, res) => {
  console.info(`Serializing user ${req.params}`);
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .send({ message: `User with id ${req.params.id} not found` });
    }
    res.status(200).send(user);
  } catch (err: any) {
    handleError(err, req, res);
  }
};

/***
 * Get a user by email
 */
export const serializeUserByEmail: RequestHandler = async (req, res) => {
  // check the path params for the email
  console.info(`Serializing user ${req.params.email}`);

  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).send({ message: `User not found` });
    }
    res.status(200).send(user);
  } catch (err: any) {
    handleError(err, req, res);
  }
};

/***
 * Update a user by id
 */
export const updateUserById: RequestHandler = async (req, res) => {
  console.info(`Updating user ${req.params.id}`);
  try {
    const user = await updateUserProfile(req.params.id, req.body);
    if (!user) {
      return res.status(404).send({ message: `Can't update, user not found` });
    }
    res.status(200).send(user);
  } catch (err: any) {
    handleError(err, req, res);
  }
};
