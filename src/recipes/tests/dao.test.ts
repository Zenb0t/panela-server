import {
	createRecipe,
	getAllRecipes,
	getAllRecipesByUserId,
	getRecipeById,
	updateRecipe,
	deleteRecipe,
} from "../dao";
import { RecipeModel } from "../model";
import { ErrorMessages as e } from "../../consts";
import { dummyRecipe, dummyRecipeList } from "./fixtures";
import { DatabaseError } from "../../utils/errors";

jest.mock("../model");

describe("Recipe DAO", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("createRecipe", () => {
		it("should create a recipe and return the recipe data", async () => {
			(RecipeModel.prototype.save as jest.Mock).mockResolvedValue(dummyRecipe);
			const recipe = await createRecipe(dummyRecipe);
			expect(recipe).toEqual(dummyRecipe);
		});

		it("should throw an error if saving the recipe fails", async () => {
			const mockError = new DatabaseError("Database save error");
			(RecipeModel.prototype.save as jest.Mock).mockRejectedValue(mockError);
			await expect(createRecipe(dummyRecipe)).rejects.toThrow(mockError);
		});
	});

	describe("getAllRecipes", () => {
		it("should return all recipes", async () => {
			(RecipeModel.find as jest.Mock).mockResolvedValue(dummyRecipeList);
			const recipes = await getAllRecipes();
			expect(recipes).toEqual(dummyRecipeList);
		});

		it("should throw a DatabaseError if fetching recipes fails", async () => {
			const mockError = new DatabaseError("Database find error");
			(RecipeModel.find as jest.Mock).mockRejectedValue(mockError);
			await expect(getAllRecipes()).rejects.toThrow(mockError);
		});
	});

	describe("getAllRecipesByUserId", () => {
		it("should return all recipes for a given user id", async () => {
			(RecipeModel.find as jest.Mock).mockResolvedValue(dummyRecipeList);
			const recipes = await getAllRecipesByUserId("user123");
			expect(recipes).toEqual(dummyRecipeList);
		});

		it("should throw a DatabaseError if fetching recipes by user id fails", async () => {
			const mockError = new DatabaseError("Database find error");
			(RecipeModel.find as jest.Mock).mockRejectedValue(mockError);
			await expect(getAllRecipesByUserId("user123")).rejects.toThrow(mockError);
		});
	});

	describe("getRecipeById", () => {
		it("should return a recipe for a given id", async () => {
			(RecipeModel.findOne as jest.Mock).mockResolvedValue(dummyRecipe);
			const recipe = await getRecipeById("1");
			expect(recipe).toEqual(dummyRecipe);
		});

		it("should throw an error if recipe not found", async () => {
			(RecipeModel.findOne as jest.Mock).mockResolvedValue(null);
			await expect(getRecipeById("nonexistent-id")).rejects.toThrow(
				new Error(e.RECIPE_NOT_FOUND_ERROR),
			);
		});

		it("should throw a DatabaseError if database operation fails", async () => {
			const mockError = new DatabaseError("Database find error");
			(RecipeModel.findOne as jest.Mock).mockRejectedValue(mockError);
			await expect(getRecipeById("1")).rejects.toThrow(mockError);
		});
	});

	describe("updateRecipe", () => {
		it("should update a recipe and return the updated data", async () => {
			(RecipeModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
				dummyRecipe,
			);
			const updatedRecipe = await updateRecipe("1", dummyRecipe);
			expect(updatedRecipe).toEqual(dummyRecipe);
		});

		it("should throw an error if recipe not found", async () => {
			(RecipeModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
			await expect(updateRecipe("nonexistent-id", dummyRecipe)).rejects.toThrow(
				new Error(e.RECIPE_NOT_FOUND_ERROR),
			);
		});

		it("should throw a DatabaseError if updating the recipe fails", async () => {
			const mockError = new DatabaseError("Database update error");
			(RecipeModel.findOneAndUpdate as jest.Mock).mockRejectedValue(mockError);
			await expect(updateRecipe("1", dummyRecipe)).rejects.toThrow(mockError);
		});
	});

	describe("deleteRecipe", () => {
		it("should delete a recipe and return the delete result", async () => {
			(RecipeModel.deleteOne as jest.Mock).mockResolvedValue({
				acknowledged: true,
				deletedCount: 1,
			});
			const result = await deleteRecipe("1");
			expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
		});

		it("should throw an error if the recipe cannot be deleted", async () => {
			(RecipeModel.deleteOne as jest.Mock).mockResolvedValue({
				acknowledged: true,
				deletedCount: 0,
			});
			await expect(deleteRecipe("nonexistent-id")).rejects.toThrow(
				new Error(e.RECIPE_NOT_FOUND_ERROR),
			);
		});

		it("should throw a DatabaseError if the delete operation fails", async () => {
			const mockError = new DatabaseError("Database delete error");
			(RecipeModel.deleteOne as jest.Mock).mockRejectedValue(mockError);
			await expect(deleteRecipe("1")).rejects.toThrow(mockError);
		});
	});
});
