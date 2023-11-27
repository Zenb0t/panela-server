import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

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
    // TODO: Add logging
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
    res.status(500).send({ message: err.message || "An error occurred" });
  }
  next();
};
