import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import logger from "./logger";
import { ZodError } from "zod";

/***
 * A simple error handler middleware that returns a 500 status code and the error message.
 */
export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    // Log the error once at the start
    logger.error(err);

    // Use a switch statement to handle different types of errors
    switch (true) {
      case err instanceof ZodError:
        const zodError = err as ZodError;
        const message = zodError.issues.map((issue) => issue.message).join(", ");
        return res.status(400).send({ message });

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
