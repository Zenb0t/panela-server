import { z } from "zod";
export interface Ingredient {
	_id?: string;
	name: string;
	measuringUnit: MeasuringUnit;
	amount: number; // Quantity of the ingredient
	costPerUnit?: number; // Cost per unit of measurement
}

export const ZodIngredientSchema = z.object({
	name: z.string().min(1, "Name is required"),
	measuringUnit: z.string().min(1, "Measuring unit is required"),
	amount: z.number().min(0.01, "Amount must be greater than 0.01"),
	costPerUnit: z.number().optional().default(0),
});

export interface ParsedIngredient {
	amount: number | undefined;
	unit: string;
	name: string;
	source: string;
}

export enum MeasuringUnit {
	GRAM = "g",
	KILOGRAM = "kg",
	OUNCE = "oz",
	POUND = "lb",
	TEASPOON = "tsp",
	TABLESPOON = "Tbs", // Capital T to avoid confusion with teaspoon and to match convert-units package
	CUP = "cup",
	PINT = "pt",
	QUART = "qt",
	GALLON = "gal",
	LITER = "l",
	MILLILITER = "ml",
	FLOZ = "fl-oz",
	PIECE = "pcs",
	COUPLE = "cp",
	DOZEN = "doz",
	HALF_DOZEN = "half-dozen",
}

export const MEASURING_UNITS_MAPPING = {
	g: MeasuringUnit.GRAM,
	gram: MeasuringUnit.GRAM,
	grams: MeasuringUnit.GRAM,
	kg: MeasuringUnit.KILOGRAM,
	kilogram: MeasuringUnit.KILOGRAM,
	kilograms: MeasuringUnit.KILOGRAM,
	oz: MeasuringUnit.OUNCE,
	ounce: MeasuringUnit.OUNCE,
	ounces: MeasuringUnit.OUNCE,
	lb: MeasuringUnit.POUND,
	pound: MeasuringUnit.POUND,
	pounds: MeasuringUnit.POUND,
	tsp: MeasuringUnit.TEASPOON,
	teaspoon: MeasuringUnit.TEASPOON,
	teaspoons: MeasuringUnit.TEASPOON,
	tbs: MeasuringUnit.TABLESPOON,
	tbsp: MeasuringUnit.TABLESPOON,
	tablespoon: MeasuringUnit.TABLESPOON,
	tablespoons: MeasuringUnit.TABLESPOON,
	cup: MeasuringUnit.CUP,
	cups: MeasuringUnit.CUP,
	pt: MeasuringUnit.PINT,
	pint: MeasuringUnit.PINT,
	pints: MeasuringUnit.PINT,
	qt: MeasuringUnit.QUART,
	quart: MeasuringUnit.QUART,
	quarts: MeasuringUnit.QUART,
	gal: MeasuringUnit.GALLON,
	gallon: MeasuringUnit.GALLON,
	gallons: MeasuringUnit.GALLON,
	l: MeasuringUnit.LITER,
	liter: MeasuringUnit.LITER,
	liters: MeasuringUnit.LITER,
	ml: MeasuringUnit.MILLILITER,
	milliliter: MeasuringUnit.MILLILITER,
	milliliters: MeasuringUnit.MILLILITER,
	"fl-oz": MeasuringUnit.FLOZ,
	"fluid-ounce": MeasuringUnit.FLOZ,
	"fluid-ounces": MeasuringUnit.FLOZ,
	pcs: MeasuringUnit.PIECE,
	piece: MeasuringUnit.PIECE,
	pieces: MeasuringUnit.PIECE,
	cp: MeasuringUnit.COUPLE,
	couple: MeasuringUnit.COUPLE,
	couples: MeasuringUnit.COUPLE,
	doz: MeasuringUnit.DOZEN,
	dozen: MeasuringUnit.DOZEN,
	dozens: MeasuringUnit.DOZEN,
	"half-dozen": MeasuringUnit.HALF_DOZEN,
	"half-dozens": MeasuringUnit.HALF_DOZEN,
};

export const MEASURING_UNITS = Object.keys(MEASURING_UNITS_MAPPING);
