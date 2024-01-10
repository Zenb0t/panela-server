import { MeasuringUnit } from "../../types/ingredient";
import { Recipe } from "../../types/recipe";

export const dummyRecipe: Recipe = {
	title: "Chocolate Chip Cookies",
	description:
		"Delicious chocolate chip cookies with a soft and chewy center.",
	totalTimeInMinutes: 45,
	cost: 10.0,
	ingredients: [
		{
			name: "All-purpose flour",
			measuringUnit: MeasuringUnit.CUP,
			amount: 2.5,
		},
		{
			name: "Baking soda",
			measuringUnit: MeasuringUnit.TEASPOON,
			amount: 1,
		},
		{
			name: "Salt",
			measuringUnit: MeasuringUnit.TEASPOON,
			amount: 1,
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
