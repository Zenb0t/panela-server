import Fuse from "fuse.js";
import { Duration } from "luxon";
import {
	MEASURING_UNITS,
	MEASURING_UNITS_MAPPING,
	ParsedIngredient,
} from "../types/ingredient";
import { Recipe } from "../types/recipe";
import logger from "../utils/logger";
import { fractionToDecimal, multiplyExpression } from "../utils/math";
import {
	combinedPattern,
	unicodeFractionPattern,
	mixedFractionPattern,
	fractionPattern,
	rangePattern,
	multiplicationPattern,
	decimalPattern,
	wholeNumberPattern,
} from "../utils/patterns";

export function parseRecipeData(data: any): Recipe {
	try {
		logger.info("Parsing recipe data");
		// Parse time

		const totalTime = parseTime(data.totalTime);
		const prepTime = parseTime(data.prepTime);
		const cookTime = parseTime(data.cookTime);

		// Parse ingredients

		if (data.recipeIngredient) {
			logger.debug("Recipe ingredients found");
			const ingredients = data.recipeIngredient as string[];
			data.recipeIngredient = ingredients.map((ingredient) => {
				const parsedIngredient = parseIngredient(ingredient);
				logger.debug(parsedIngredient);
				return parsedIngredient;
			});
		} else if (data.ingredients) {
			// Some websites use the superseded property "ingredients" instead of "recipeIngredient"
			logger.debug("Ingredients (Legacy) found");
			const ingredients = data.ingredients as string[];
			data.ingredients = ingredients.map((ingredient) => {
				const parsedIngredient = parseIngredient(ingredient);
				logger.debug(parsedIngredient);
				return parsedIngredient;
			});
		}

		// Parse instructions

		if (data.recipeInstructions) {
			logger.debug("Recipe instructions found");
			const instructions = data.recipeInstructions as any;
			data.recipeInstructions = parseInstructions(instructions);
		}

		// Parse images

		if (data.image) {
			logger.debug("Recipe image found");
			data.image = parseImage(data.image);
		}

		// Parse source

		if (data.url) {
			logger.debug("Recipe source found");
		} else if (data.mainEntityOfPage) {
			// Some websites use the property "mainEntityOfPage" instead of "url"
			logger.debug("Recipe source (Legacy) found");
			data.url = data.mainEntityOfPage["@id"];
		}

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
			// Check if is a string or array
			if (Array.isArray(data.recipeYield)) {
				recipe.servings = parseInt(data.recipeYield[0]);
			} else {
				recipe.servings = parseInt(data.recipeYield);
			}
		}

		if (data.author) {
			recipe.author = data.author.name;
		}

		if (data.recipeIngredient) {
			recipe.ingredients = data.recipeIngredient;
		} else if (data.ingredients) {
			recipe.ingredients = data.ingredients;
		}

		if (data.recipeInstructions) {
			recipe.instructions = data.recipeInstructions;
		}

		if (data.keywords) {
			recipe.keywords = data.keywords;
		}

		if (data.recipeCategory) {
			recipe.recipeCategory = data.recipeCategory;
		}

		if (data.recipeCuisine) {
			recipe.recipeCuisine = data.recipeCuisine;
		}

		if (data.aggregateRating) {
			recipe.aggregateRating = {
				ratingCount: data.aggregateRating.ratingCount,
				ratingValue: data.aggregateRating.ratingValue,
				reviewCount: data.aggregateRating.reviewCount,
			};
		}

		return recipe;
	} catch (error) {
		logger.error(error);
		console.log(error);
		throw error;
	}
}

function parseTime(time: string): number {
	const duration = Duration.fromISO(time);
	return duration.as("minutes");
}

function parseImage(data: any | any[]): string | string[] {
	// Check if it is of type "ImageObject"
	if (data["@type"] === "ImageObject") {
		logger.debug("Data image is an ImageObject");
		data = data.url["@id"] as string;
	}

	if (Array.isArray(data)) {
		logger.debug("Data image is an array");
		data = data.map((img: any) => img["@id"] as string);
	} else if (typeof data === "object") {
		logger.debug("Data image is an object");
		data = data.url["@id"] as string;
	}
	return data;
}

// TODO: Refactor this function to deal with https://www.thechunkychef.com/20-minute-greek-chicken-rice-bowl/ case
function parseInstructions(instructions: any): string[] {
	const parsedInstructions: string[] = [];

	logger.debug("Parsing instructions");
	// Check if the instructions are of type "HowToSection"

	console.log(instructions);

	if (instructions["@type"] === "HowToSection") {
		// If the instructions are of type "HowToSection", they are an array of "HowToStep" objects or a single "HowToStep" object
		// So we iterate over them and extract the text
		for (const section of instructions) {
			if (Array.isArray(section.itemListElement)) {
				for (const step of section.itemListElement) {
					parsedInstructions.push(step.text);
				}
			} else {
				parsedInstructions.push(section.itemListElement.text);
			}
		}
	}

	// Check if the instructions are an array of type "HowToStep"

	if (
		Array.isArray(instructions) &&
		instructions[0]["@type"] === "HowToStep"
	) {
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
		unit: possibleUnit.toLowerCase().trim(),
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
