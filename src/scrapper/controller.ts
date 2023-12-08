import { RequestHandler } from "express";

export const scrapeURL: RequestHandler = async (req, res, next) => {
	res.status(200).send({ message: "Scraping..." });
}
