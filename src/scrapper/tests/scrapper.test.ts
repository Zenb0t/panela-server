import { extractRecipeData } from "../scrapper";
import { json } from "./fixture";

describe("extractRecipeData", () => {
    it("should extract recipe data from JSON-LD object", () => {
        const data = json;

        const expectedRecipe = {
            name: "Delicious Recipe",
            description: "This is a delicious recipe",
            recipeYield: "4 servings",
            recipeIngredient: ["ingredient1", "ingredient2"],
            recipeInstructions: "Step 1, Step 2, Step 3",
            datePublished: "2022-01-01",
            prepTime: "PT15M",
            cookTime: "PT30M",
            totalTime: "PT45M",
            keywords: ["delicious", "recipe"],
            recipeCategory: "Main Course",
            recipeCuisine: "Italian",
            suitableForDiet: "Vegetarian"
        };

        const extractedRecipe = extractRecipeData(data);
        expect(extractedRecipe).toEqual(expectedRecipe);
    });

    it("should throw an error if no recipe is found", () => {
        const data = {
            "@graph": [
                {
                    "@type": "http://schema.org/OtherType",
                    "name": "Not a Recipe"
                }
            ]
        };

        expect(() => extractRecipeData(data)).toThrowError("No recipe found");
    });

    it("should throw an error if no data is found", () => {
        const data = {};

        expect(() => extractRecipeData(data)).toThrowError("No data found");
    });
});

