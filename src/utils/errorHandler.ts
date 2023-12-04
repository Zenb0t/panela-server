import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import logger from "./logger";
import { ZodError } from "zod";
import { ValidationError } from "./errors";

/***
 * A simple error handler middleware that logs the error and sends a response
 * @param err - The error object
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The Express next function
 * @returns void
 */
export const handleError = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err) {
		// Log the error once at the start
		logger.error(`An ${err.name} occured: ${err.message}`);
		logger.error(err.stack);

		//Switch statement to handle different types of errors
		switch (true) {
		case err instanceof ZodError:
			const zodError = err as ZodError;
			// Get the error message from the ZodError object
			// add the issue.path and issue.message to the message
			const message = zodError.issues
				.map((issue) => {
					return `${issue.path}: ${issue.message}`;
				})
				.join();
			return res.status(400).send({ message });

		case err instanceof ValidationError:
			return res.status(400).send({ message: err.message });

		case err instanceof Error:
			return res.status(500).send({ message: err.message });

		default:
			// Catch-all for any other types of errors
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	// If there's no error, call the next middleware function
	next();
};
