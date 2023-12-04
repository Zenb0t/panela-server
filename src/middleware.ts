import express, { RequestHandler } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import sanitizedConfig from "./config";
import { handleError } from "./utils/errorHandler";

export const authMiddleware = auth({
	issuerBaseURL: sanitizedConfig.AUTH0_DOMAIN,
	audience: sanitizedConfig.AUDIENCE,
});

/**
 * Express Router for global middleware configurations.
 * Handles JSON parsing, urlencoded parsing, and CORS.
 * @type {express.Router}
 */
const globalMiddleware = express.Router();

globalMiddleware.use(express.json());
globalMiddleware.use(express.urlencoded({ extended: true }));

globalMiddleware.use(cors());

// Error handler middleware, keep as the last middleware to catch all errors
globalMiddleware.use(handleError);

export default globalMiddleware;
