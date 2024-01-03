import axios, { AxiosError } from "axios";
import { JSDOM } from "jsdom";
import jsonld from "jsonld";
import { Recipe } from "../types/recipe";
import logger from "../utils/logger";
import Fuse from "fuse.js";
import {
	MEASURING_UNITS_MAPPING,
	MEASURING_UNITS,
	ParsedIngredient,
} from "../types/ingredient";
import {
	combinedPattern,
	decimalPattern,
	fractionPattern,
	mixedFractionPattern,
	multiplicationPattern,
	rangePattern,
	unicodeFractionPattern,
	wholeNumberPattern,
} from "../utils/patterns";
import { fractionToDecimal, multiplyExpression } from "../utils/math";
import { Duration } from "luxon";
import { parseRecipeData } from "./parsers";

// TODO Extract this to a separate file
const context: jsonld.ContextDefinition = {
	// Recipe Information
	name: "http://schema.org/name",
	description: "http://schema.org/description",
	image: "http://schema.org/image",
	recipeYield: "http://schema.org/recipeYield",
	recipeIngredient: "http://schema.org/recipeIngredient",
	ingredients: "http://schema.org/ingredients",
	recipeInstructions: {
		"@id": "http://schema.org/recipeInstructions",
		"@type": "@id",
	},
	HowToStep: "http://schema.org/HowToStep",
	itemListElement: "http://schema.org/itemListElement",
	text: "http://schema.org/text",
	datePublished: {
		"@id": "http://schema.org/datePublished",
		"@type": "http://schema.org/Date",
	},
	prepTime: "http://schema.org/prepTime",
	cookTime: "http://schema.org/cookTime",
	totalTime: "http://schema.org/totalTime",
	recipeCategory: "http://schema.org/recipeCategory",
	recipeCuisine: "http://schema.org/recipeCuisine",
	suitableForDiet: "http://schema.org/suitableForDiet",
	// Author Information
	author: "http://schema.org/author",
	// Meta
	keywords: "http://schema.org/keywords",
	aggregateRating: "http://schema.org/aggregateRating",
	ratingValue: "http://schema.org/ratingValue",
	ratingCount: "http://schema.org/ratingCount",
	mentions: {
		"@id": "http://schema.org/mentions",
		"@type": "@id",
	},
	isPartOf: "http://schema.org/isPartOf",
	mainEntityOfPage: "http://schema.org/mainEntityOfPage",
	// Nutrition
	nutrition: "http://schema.org/nutrition",
	calories: "http://schema.org/calories",
	fatContent: "http://schema.org/fatContent",
	cholesterolContent: "http://schema.org/cholesterolContent",
	sodiumContent: "http://schema.org/sodiumContent",
	carbohydrateContent: "http://schema.org/carbohydrateContent",
	fiberContent: "http://schema.org/fiberContent",
	sugarContent: "http://schema.org/sugarContent",
	proteinContent: "http://schema.org/proteinContent",
	saturatedFatContent: "http://schema.org/saturatedFatContent",
	transFatContent: "http://schema.org/transFatContent",
	unsaturatedFatContent: "http://schema.org/unsaturatedFatContent",
	servingSize: "http://schema.org/servingSize",
	Date: "http://schema.org/Date",
	url: "http://schema.org/url",
};

async function fetchHtml(url: string | null): Promise<string> {
	if (!url) {
		return "";
	}

	try {
		const response = await axios.get(url, {
			headers: {
				// Prevents the website from blocking the request from axios
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
			},
		});
		return response.data;
	} catch (error) {
		logger.error("Error fetching HTML", error);
		throw error as AxiosError;
	}
}

/***
 * Scrapes a recipe from a given URL
 * @param url - URL of the recipe to scrape
 * @returns void
 * @throws Error if the recipe cannot be scraped
 * @example
 * scrapeRecipe('https://example-recipe-website.com');
 */
export async function scrapeRecipe(url: string) {
	try {
		const html = await fetchHtml(url);
		const dom = new JSDOM(html);
		const document = dom.window.document;
		const data = await scanForjsonLD(document);
		const recipe = parseRecipeData(data);
		return recipe;
	} catch (error) {
		logger.error("Error scraping recipe:", error);
		throw error;
	}
}

async function scanForjsonLD(document: Document): Promise<any | null> {
	const jsonLDs = document.querySelectorAll(
		"script[type='application/ld+json']"
	);
	for (const script of jsonLDs) {
		try {
			if (!script.textContent) {
				continue;
			}
			const jsonData = JSON.parse(script.textContent);
			const compactedData = await jsonld.compact(jsonData, context);
			const extractedData = extractRecipeData(compactedData);
			return extractedData;
		} catch (error) {
			logger.error("Error parsing JSON-LD:", error);
		}
	}
	return null;
}

export function extractRecipeData(data: jsonld.NodeObject) {
	logger.info("Extracting recipe data...");
	const type = data["@type"];
	let recipe;

	// There are 3 cases:
	// 1. The data is a single object with the type "http://schema.org/Recipe"
	// 2. The data is an array of objects with the type "http://schema.org/Recipe"
	// 3. The data is an array of objects with a Graph array containing the type "http://schema.org/Recipe"

	if (type === "http://schema.org/Recipe") {
		logger.debug("Data is a single object");
		recipe = data;
	} else if (
		Array.isArray(type) &&
		type.includes("http://schema.org/Recipe")
	) {
		logger.debug("Data is an array");
		recipe = data;
	} else if (data["@graph"] && Array.isArray(data["@graph"])) {
		logger.debug("Graph is an array");
		const graph = data["@graph"];
		recipe = graph.find(
			(item: any) => item["@type"] === "http://schema.org/Recipe"
		);
		if (!recipe) {
			throw new Error("No recipe found");
		}
	} else {
		logger.debug(data);
		throw new Error("Invalid data format");
	}

	const newRecipe = {
		name: recipe.name,
		description: recipe.description,
		recipeYield: recipe.recipeYield,
		recipeIngredient: recipe.recipeIngredient,
		ingredients: recipe.ingredients,
		recipeInstructions: recipe.recipeInstructions,
		datePublished: recipe.datePublished,
		prepTime: recipe.prepTime,
		cookTime: recipe.cookTime,
		totalTime: recipe.totalTime,
		keywords: recipe.keywords,
		recipeCategory: recipe.recipeCategory,
		recipeCuisine: recipe.recipeCuisine,
		suitableForDiet: recipe.suitableForDiet,
		aggregateRating: recipe.aggregateRating,
		nutrition: recipe.nutrition,
		mentions: recipe.mentions,
		isPartOf: recipe.isPartOf,
		mainEntityOfPage: recipe.mainEntityOfPage,
		author: recipe.author,
		image: recipe.image,
		url: recipe.url,
	};

	return newRecipe;
}
