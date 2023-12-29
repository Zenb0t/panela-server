import { RequestHandler } from "express";
import { scrapeRecipe } from "./scrapper";

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
export const scrapeURL: RequestHandler = async (req, res, next) => {
	// get url from query params
	const url = req.query.url;
	const data = await scrapeRecipe(url as string);
	res.status(200).send({ message: "Scraping... " + url, data });
};
