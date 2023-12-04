import { RequestHandler } from "express";
import { UserModel } from "./model";
import { handleError } from "../utils/errorHandler";
import { ErrorMessages as e } from "../consts";
import logger from "../utils/logger";
import { Role, ZodUserSchema } from "../types/user";
import { validateRole } from "../utils/validation";
import { ZodError } from "zod";

/***
 * Validate the user data sent in the request body
 */
export const validateUserData: RequestHandler = async (req, res, next) => {
	if (!req.body.role) {
		console.log("No role provided, defaulting to USER");
		req.body.role = Role.USER;
	}
	const { user, role } = req.body;	

	logger.info("Validating user data'");
	try {
		const result = ZodUserSchema.safeParse(req.body);
		if (!result.success) {
			const error = result.error as ZodError;
			return res
				.status(400)
				.send({ message: e.INCOMPLETE_USER_DATA_ERROR, error: error });
		}
		validateRole(role);
		if (user && user.role !== role) {
			return res
				.status(401)
				.send({ message: e.ROLE_CHANGE_NOT_ALLOWED_ERROR });
		}
		logger.info("User data validated");
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
			return res
				.status(400)
				.send({ message: e.USER_ALREADY_EXISTS_ERROR });
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
		const filterParam = id ? { id: id } : { email: email };

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
