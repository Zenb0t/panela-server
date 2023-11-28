import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import logger from "./logger";

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
    // TODO: Improve error handling
    logger.error(err.message);
    res.status(500).send({ message: err.message || "An error occurred" });
  }
  next();
};
