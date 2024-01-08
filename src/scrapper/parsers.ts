import Fuse from "fuse.js";
import he from "he";
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
import { JSDOM } from "jsdom";

export function parseRecipeData(data: any): Recipe {
	try {
		logger.info("Parsing recipe data");
		// Parse time

		const totalTime = parseTime(data.totalTime);
		const prepTime = parseTime(data.prepTime);
		const cookTime = parseTime(data.cookTime);

		// Parse ingredients

		if (data.recipeIngredient) {
			logger.silly("Recipe ingredients found");
			const ingredients = data.recipeIngredient as string[];
			data.recipeIngredient = parseIngredients(ingredients);
		} else if (data.ingredients) {
			// Some websites use the superseded property "ingredients" instead of "recipeIngredient"
			logger.silly("Ingredients (Legacy) found");
			const ingredients = data.ingredients as string[];
			data.recipeIngredient = parseIngredients(ingredients);
		}

		// Parse instructions

		if (data.recipeInstructions) {
			logger.silly("Recipe instructions found");
			const instructions = data.recipeInstructions as any;
			data.recipeInstructions = parseInstructions(instructions);
		}

		// Clean up instructions
		// Clean up html parts like &nbsp; and &deg; and replace them with their unicode equivalent

		if (data.recipeInstructions) {
			logger.silly("Cleaning up instructions");
			const instructions = data.recipeInstructions as string[];
			data.recipeInstructions = instructions.map((instruction) =>
				he.decode(instruction)
			);
		}

		// Parse images

		if (data.image) {
			logger.silly("Recipe image found");
			data.image = parseImage(data.image);
		}

		// Parse source

		if (data.url) {
			logger.debug("Recipe source found");
			data.url = data.url["@id"];
		} else if (data.mainEntityOfPage) {
			// Some websites use the property "mainEntityOfPage" instead of "url"
			logger.debug("Recipe source (Legacy) found");
			data.url = data.mainEntityOfPage["@id"];
		}

		const recipe: Recipe = {
			title: he.decode(data.name),
			description: he.decode(data.description),
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

		console.log(recipe.ingredients);

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

enum ImageDataType {
	ImageObjectArray,
	ImageObject,
	Array,
	Object,
	Unknown,
}

function getImageDataType(data: any): ImageDataType {
	if (Array.isArray(data) && data[0]["@type"] === "ImageObject") {
		return ImageDataType.ImageObjectArray;
	} else if (data["@type"] === "ImageObject") {
		return ImageDataType.ImageObject;
	} else if (Array.isArray(data)) {
		return ImageDataType.Array;
	} else if (typeof data === "object") {
		return ImageDataType.Object;
	}

	return ImageDataType.Unknown;
}

function parseImage(data: any | any[]): string | string[] | undefined {
	console.log("Parsing image");
	console.log(data);

	const dataType = getImageDataType(data);

	switch (dataType) {
		case ImageDataType.ImageObjectArray:
			logger.silly("Data image is an array of ImageObject");
			return data.map((img: any) => img.url["@id"] as string);
		case ImageDataType.ImageObject:
			logger.silly("Data image is an ImageObject");
			return data.url["@id"] as string;
		case ImageDataType.Array:
			logger.silly("Data image is an array");
			return data.map((img: any) => img["@id"] as string);
		case ImageDataType.Object:
			logger.silly("Data image is an object");
			return data.url["@id"] as string;
		default:
			logger.silly("Unknown data type");
			return undefined;
	}
}

enum InstructionType {
	HTML,
	HowToSection,
	HowToStepArray,
	StringArray,
	String,
	Unknown,
}

function getInstructionType(instructions: any): InstructionType {
	if (
		typeof instructions === "string" &&
		instructions.trim().startsWith("<")
	) {
		return InstructionType.HTML;
	} else if (
		Array.isArray(instructions) &&
		instructions[0]["@type"] === "HowToSection"
	) {
		return InstructionType.HowToSection;
	} else if (
		Array.isArray(instructions) &&
		instructions[0]["@type"] === "HowToStep"
	) {
		return InstructionType.HowToStepArray;
	} else if (
		Array.isArray(instructions) &&
		typeof instructions[0] === "string"
	) {
		return InstructionType.StringArray;
	} else if (typeof instructions === "string") {
		return InstructionType.String;
	}

	return InstructionType.Unknown;
}

function parseInstructions(instructions: any): string[] {
	const parsedInstructions: string[] = [];

	logger.debug("Parsing instructions");

	const type = getInstructionType(instructions);

	switch (type) {
		case InstructionType.HTML:
			parsedInstructions.push(...parseHtmlInstructions(instructions));
			return parsedInstructions;
		case InstructionType.HowToSection:
			for (const section of instructions) {
				if (Array.isArray(section.itemListElement)) {
					for (const step of section.itemListElement) {
						parsedInstructions.push(step.text);
					}
				} else {
					parsedInstructions.push(section.itemListElement.text);
				}
			}
			return parsedInstructions;
		case InstructionType.HowToStepArray:
			for (const step of instructions) {
				parsedInstructions.push(step.text);
			}
			return parsedInstructions;
		case InstructionType.StringArray:
			for (const step of instructions) {
				parsedInstructions.push(step);
			}
			return parsedInstructions;
		case InstructionType.String:
			parsedInstructions.push(instructions);
			return parsedInstructions;
		default:
			logger.debug("Instructions are not in a known format");
	}

	return parsedInstructions;
}

function parseHtmlInstructions(htmlInstructions: string): string[] {
	const dom = new JSDOM(htmlInstructions);

	// Query all list items in the ordered list
	let items = dom.window.document.querySelectorAll("ol > li");
	// If it's not an ordered list, query all list items in the unordered list
	if (items.length === 0) {
		items = dom.window.document.querySelectorAll("ul > li");
	}
	if (items.length === 0) {
		// If it's not a list, query all paragraphs
		items = dom.window.document.querySelectorAll("p");
	}

	// Map each list item to its text content, trimming any excess whitespace and removing null and undefined values
	const parsedHTML = Array.from(items)
		.map((item) => item.textContent?.trim())
		.filter((item): item is string => Boolean(item));

	return parsedHTML;
}

function parseIngredients(ingredients: string[]): ParsedIngredient[] {
	const parsedIngredients = ingredients.map((ingredient) => {
		const parsedIngredient = parseIngredient(ingredient);
		logger.silly(JSON.stringify(parsedIngredient)); // Print the parsed ingredient as a string
		return parsedIngredient as ParsedIngredient;
	});
	return parsedIngredients;
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
		name: he.decode(name),
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
