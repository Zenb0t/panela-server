import { RequestHandler } from "express";
import { scrapeRecipe } from "./scrapper";
import { AxiosError } from "axios";
/***
 * Scrape URL
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns void
 * @example
 *  Write the example of the query params here
 * http://localhost:3000/scrape?url=https://example-recipe-website.com
 */
export const scrapeURL: RequestHandler = async (req, res) => {
	// get url from query params
	const url = req.query.url;
	try {
		const data = await scrapeRecipe(url as string);
		res.status(200).send(data);
	} catch (error) {
		if (error instanceof AxiosError) {
			res.status(error.response?.status || 500).send({ message: "Axios error", code: error.code, status: error.status});
		} else {
			res.status(500).send({ message: "Generic error", error });
		}
	}
};
