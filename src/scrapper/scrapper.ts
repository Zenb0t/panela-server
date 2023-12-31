import axios, { AxiosError } from "axios";
import { JSDOM } from "jsdom";
import jsonld from "jsonld";
import { Recipe } from "../types/recipe";
import logger from "../utils/logger";
import Fuse from "fuse.js";
import {
	MEASURING_UNITS_MAPPING,
	MEASURING_UNITS,
	MeasuringUnit,
} from "../types/ingredient";

// TODO Extract this to a separate file
const context: jsonld.ContextDefinition = {
	// Recipe Information
	name: "http://schema.org/name",
	description: "http://schema.org/description",
	image: "http://schema.org/image",
	recipeYield: "http://schema.org/recipeYield",
	recipeIngredient: "http://schema.org/recipeIngredient",
	recipeInstructions: {
		"@id": "http://schema.org/recipeInstructions",
		"@type": "@id",
	},
	// Author Information
	author: "http://schema.org/author",
	HowToStep: "http://schema.org/HowToStep",
	itemListElement: "http://schema.org/itemListElement",
	text: "http://schema.org/text",
	datePublished: "http://schema.org/datePublished",
	prepTime: "http://schema.org/prepTime",
	cookTime: "http://schema.org/cookTime",
	totalTime: "http://schema.org/totalTime",
	recipeCategory: "http://schema.org/recipeCategory",
	recipeCuisine: "http://schema.org/recipeCuisine",
	suitableForDiet: "http://schema.org/suitableForDiet",
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
		const response = await axios.get(url);
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
		return data;
	} catch (error) {
		logger.error("Error scraping recipe:", error);
		throw error;
	}
}

async function scanForjsonLD(document: Document): Promise<Recipe | null> {
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
			const extractedData = await extractRecipeData(compactedData);
			return extractedData;
		} catch (error) {
			console.error("Error parsing JSON-LD:", error);
		}
	}
	return null;
}

export async function extractRecipeData(data: jsonld.NodeObject): Promise<any> {
	console.log("Extracting recipe data...");
	// transverse the JSON-LD object to find the recipe data
	// assuming the recipe data inside the @graph array
	const graph = data["@graph"];
	if (!graph) {
		throw new Error("No data found");
	} else if (Array.isArray(graph)) {
		console.log("Graph is an array");
		const recipe = graph.find(
			(item: any) => item["@type"] === "http://schema.org/Recipe"
		);
		if (!recipe) {
			throw new Error("No recipe found");
		}
		// extract the recipe data
		// console.log("Recipe found:", recipe);
		const newRecipe = {
			name: recipe.name,
			description: recipe.description,
			recipeYield: recipe.recipeYield,
			recipeIngredient: recipe.recipeIngredient,
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
		// console.dir(newRecipe, { depth: null });
		if (newRecipe.recipeIngredient) {
			console.log("Recipe ingredients found");
			const ingredients = newRecipe.recipeIngredient as string[];
			ingredients.forEach((ingredient) => {
				const parsedIngredient = parseIngredient(ingredient);
				console.log(parsedIngredient);
				ingredient = parsedIngredient;
			});
			newRecipe.recipeIngredient = ingredients;
		}
		return newRecipe;
	}
}

function parseIngredient(ingredient: string): any {
    const options = {
      includeScore: true,
      threshold: 0.6,
    };
    const fuse = new Fuse(MEASURING_UNITS, options);
  
    // Match amount and unit
    const pattern = /(\d+\/\d+|\d+\s*\d*\/\d*|\d+-\d+|\d+)?\s*([a-zA-Z]*)/;
    const match = pattern.exec(ingredient);
    const amount = match ? match[1] : undefined;
    const possibleUnit = match ? match[2] : "";
  
    // Match unit
    // First try to match the whole string with the units

    const unitMatch = fuse.search(possibleUnit);
    console.log("Possible unit:", possibleUnit);
    console.log("Unit match:", unitMatch);
    let unit = "unknown";
    if (unitMatch.length > 0) {
      unit = unitMatch[0].item;
    } else {
      unit = possibleUnit;
    }
  
    // Match name
    const name = ingredient
      .replace(pattern, "")
      .trim(); // The rest is name
  
    const ingredientData = {
      amount: amount,
      unit: unit,
      name: name,
    };
  
    return ingredientData;
  }
