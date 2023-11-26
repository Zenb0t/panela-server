import { ErrorRequestHandler } from "express";


export const handleError: ErrorRequestHandler = (err, req, res,) => {
    console.error(err);
    res.status(500).send({ message: err.message || "An error occurred" });
};