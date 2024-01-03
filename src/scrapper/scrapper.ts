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
	// Author Information
	author: "http://schema.org/author",
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
			const parsedData = parseRecipeData(extractedData);
			return extractedData;
		} catch (error) {
			console.error("Error parsing JSON-LD:", error);
		}
	}
	return null;
}

export async function extractRecipeData(data: jsonld.NodeObject): Promise<any> {
	console.log("Extracting recipe data...");
	const type = data["@type"];
	let recipe;

	// There are 3 cases:
	// 1. The data is a single object with the type "http://schema.org/Recipe"
	// 2. The data is an array of objects with the type "http://schema.org/Recipe"
	// 3. The data is an array of objects with a Graph array containing the type "http://schema.org/Recipe"

	if (type === "http://schema.org/Recipe") {
		console.debug("Data is a single object");
		recipe = data;
	} else if (
		Array.isArray(type) &&
		type.includes("http://schema.org/Recipe")
	) {
		console.debug("Data is an array");
		recipe = data;
	} else if (data["@graph"] && Array.isArray(data["@graph"])) {
		console.log("Graph is an array");
		const graph = data["@graph"];
		recipe = graph.find(
			(item: any) => item["@type"] === "http://schema.org/Recipe"
		);
		if (!recipe) {
			throw new Error("No recipe found");
		}
	} else {
		console.debug(data);
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

	// Parse ingredients

	if (newRecipe.recipeIngredient) {
		logger.debug("Recipe ingredients found");
		const ingredients = newRecipe.recipeIngredient as string[];
		newRecipe.recipeIngredient = ingredients.map((ingredient) => {
			const parsedIngredient = parseIngredient(ingredient);
			logger.debug(parsedIngredient);
			return parsedIngredient;
		});
	} else if (newRecipe.ingredients) {
		// Some websites use the superseded property "ingredients" instead of "recipeIngredient"
		logger.debug("Ingredients found");
		const ingredients = newRecipe.ingredients as string[];
		newRecipe.ingredients = ingredients.map((ingredient) => {
			const parsedIngredient = parseIngredient(ingredient);
			logger.debug(parsedIngredient);
			return parsedIngredient;
		});
	}

	// Parse instructions

	if (newRecipe.recipeInstructions) {
		console.log("Recipe instructions found");
		const instructions = newRecipe.recipeInstructions as any;
		newRecipe.recipeInstructions = parseInstructions(instructions);
	}

	return newRecipe;
}

function parseRecipeData(data: any): Recipe {
	const totalTime = Duration.fromISO(data.totalTime).as("minutes");
	const prepTime = Duration.fromISO(data.prepTime).as("minutes");
	const cookTime = Duration.fromISO(data.cookTime).as("minutes");

	const recipe: Recipe = {
		title: data.name,
		description: data.description,
		totalTimeInMinutes: totalTime,
		prepTimeInMinutes: prepTime,
		cookTimeInMinutes: cookTime,
		ingredients: [],
		instructions: [],
		imageUrl: data.image,
		ownerId: "",
		sourceUrl: data.url,
	};

	if (data.recipeYield) {
		recipe.servings = data.recipeYield;
	}

	if (data.author) {
		recipe.author = data.author;
	}

	if (data.recipeIngredient) {
		recipe.ingredients = data.recipeIngredient;
	} else if (data.ingredients) {
		recipe.ingredients = data.ingredients;
	}

	if (data.recipeInstructions) {
		recipe.instructions = data.recipeInstructions;
	}

	return recipe;
}

function parseInstructions(instructions: any): string[] {
	const parsedInstructions: string[] = [];

    console.log("Parsing instructions");
    console.log(instructions);
	// Check if the instructions are of type "HowToSection"

	if (instructions["@type"] === "HowToSection") {
		// If the instructions are of type "HowToSection", they are an array of "HowToStep" objects
		// So we iterate over them and extract the text
		for (const step of instructions.itemListElement) {
			parsedInstructions.push(step.text);
		}
	}

    // Check if the instructions are an array of type "HowToStep"

    if (Array.isArray(instructions) && instructions[0]["@type"] === "HowToStep") {
        for (const step of instructions) {
            parsedInstructions.push(step.text);
        }
    }

    // Check if the instructions are an array of strings

    if (Array.isArray(instructions) && typeof instructions[0] === "string") {
        for (const step of instructions) {
            parsedInstructions.push(step);
        }
    }

    // Check if the instructions are a single string

    if (typeof instructions === "string") {
        parsedInstructions.push(instructions);
    }

    return parsedInstructions;
}

/**
 * Parses an ingredient string and extracts the amount, unit, and name of the ingredient.
 * @param ingredient - The ingredient string to parse.
 * @returns An object containing the parsed ingredient data.
 */
function parseIngredient(ingredient: string): any {
	const options = {
		includeScore: true,
		threshold: 0.5,
	};
	const fuse = new Fuse(MEASURING_UNITS, options);

	// Match amount
	const matchAmount = combinedPattern.exec(ingredient);
	const amount = matchAmount ? matchAmount[1] : undefined;

	// Match unit
	// First try to match the whole string with the existing units using Regex
	const unitPattern = new RegExp(
		"(?<=\\d)\\s*(" + MEASURING_UNITS.join("|") + ")\\b",
		"i"
	);
	const matchUnit = unitPattern.exec(ingredient);
	let possibleUnit = matchUnit ? matchUnit[0] : undefined;

	if (!possibleUnit) {
		// If no match, try to match the unit with the existing units using Fuse.js for fuzzy search
		const unitMatch = fuse.search(ingredient);
		if (unitMatch.length > 0) {
			possibleUnit = unitMatch[0].item;
		} else {
			possibleUnit = MEASURING_UNITS_MAPPING.piece;
		}
	}

	// Match name
	const name = ingredient
		.replace(combinedPattern, "")
		.replace(possibleUnit ? possibleUnit : "", "")
		.trim();

	// Normalize amount

	const normalizedAmount = amount ? normalizeAmount(amount) : undefined;

	const ingredientData: ParsedIngredient = {
		amount: normalizedAmount,
		unit: possibleUnit.toLowerCase(),
		name: name,
		source: ingredient,
	};

	return ingredientData;
}

/**
 * Normalizes the amount by converting it to a decimal number.
 *
 * @param amount - The amount to be normalized, which can be a whole number, fraction, mixed fraction, or range.
 * @returns The normalized amount as a decimal number.
 */
function normalizeAmount(amount: string): number {
	// Convert unicode fractions to normal fractions
	amount = amount.replace(unicodeFractionPattern, (match) => {
		const unicodeFractions: { [key: string]: string } = {
			"\u00BC": "1/4", // ¼
			"\u00BD": "1/2", // ½
			"\u00BE": "3/4", // ¾
			"\u2153": "1/3", // ⅓
			"\u2154": "2/3", // ⅔
			"\u215B": "1/8", // ⅛
			"\u215C": "3/8", // ⅜
			"\u215D": "5/8", // ⅝
			"\u215E": "7/8", // ⅞
		};
		return unicodeFractions[match];
	});

	// Convert mixed fractions to decimal
	if (mixedFractionPattern.test(amount)) {
		console.log("Mixed fraction");
		console.log(amount);
		const [whole, fraction] = amount.split(" ");
		return parseInt(whole) + fractionToDecimal(fraction);
	}

	// Convert simple fractions to decimal
	if (fractionPattern.test(amount)) {
		return fractionToDecimal(amount);
	}

	// Convert ranges to their average
	if (rangePattern.test(amount)) {
		const [min, max] = amount.split("-").map(Number);
		return (min + max) / 2;
	}

	// Handle multiplication
	if (multiplicationPattern.test(amount)) {
		return multiplyExpression(amount);
	}

	// If it's a decimal or whole number, return it directly
	if (decimalPattern.test(amount) || wholeNumberPattern.test(amount)) {
		return Number(amount);
	}

	return NaN;
}
