import { Router } from "express";
import { scrapeURL } from "./controller";

export const scrapperRouter = Router({ mergeParams: true });

scrapperRouter.get("/scrape", scrapeURL);
