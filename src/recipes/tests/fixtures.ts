import { MeasuringUnit } from "../../types/ingredient";

export const dummyRecipe = {
	title: "Chocolate Chip Cookies",
	description: "Delicious chocolate chip cookies with a soft and chewy center.",
	totalTimeInMinutes: 45,
	cost: 10.0,
	ingredients: [
		{
			ingredient: {
				name: "All-purpose flour",
				measuringUnit: MeasuringUnit.CUP,
				amount: 2.5,
				costPerUnit: 0.5,
			},
			quantity: 2.5,
			measuringUnit: MeasuringUnit.CUP,
		},
		{
			ingredient: {
				name: "Baking soda",
				measuringUnit: MeasuringUnit.TEASPOON,
				amount: 1,
				costPerUnit: 0.05,
			},
			quantity: 1,
			measuringUnit: MeasuringUnit.TEASPOON,
		},
		{
			ingredient: {
				name: "Salt",
				measuringUnit: MeasuringUnit.TEASPOON,
				amount: 1,
				costPerUnit: 0.01,
			},
			quantity: 1,
			measuringUnit: MeasuringUnit.TEASPOON,
		},
	],
	instructions: [
		"Preheat oven to 375 degrees F (190 degrees C).",
		"In a small bowl, stir together flour, baking soda, and salt.",
		"In a large bowl, cream together the butter, granulated sugar, and brown sugar.",
		"Beat in the eggs one at a time, then stir in the vanilla.",
		"Blend in the dry ingredients until just combined, then fold in the chocolate chips.",
		"Drop by rounded spoonfuls onto ungreased baking sheets.",
		"Bake for 8 to 10 minutes, or until golden brown.",
	],
	imageUrl: "https://example.com/images/chocolate-chip-cookies.jpg",
	ownerId: "user_001",
	sourceUrl: "https://example.com/recipes/chocolate-chip-cookies",
};

export const dummyRecipeList = [
	{
		...dummyRecipe,
		title: "Chocolate Chip Cookies",
	},
	{
		...dummyRecipe,
		title: "Peanut Butter Cookies",
	},
];
