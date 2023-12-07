import { Request, Response, NextFunction } from "express";
import { serializeRecipeById } from "../controller";
import { getRecipeById } from "../dao";
import { handleError } from "../../utils/errorHandler";
import { dummyRecipe } from "./fixtures";
import { ErrorMessages as e } from "../../consts";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("serializeRecipeById Middleware", () => {
	const mockResponse = (): Response => {
		const res = {} as Response;
		res.status = jest.fn().mockReturnValue(res);
		res.send = jest.fn().mockReturnValue(res);
		return res;
	};

	const mockNext: NextFunction = jest.fn();

	it("should retrieve a recipe by ID and send a 200 response", async () => {
		const dummyRecipeId = "recipe123";
		(getRecipeById as jest.Mock).mockResolvedValue(dummyRecipe);

		const req = { params: { id: dummyRecipeId } } as unknown as Request;
		const res = mockResponse();

		await serializeRecipeById(req, res, mockNext);

		expect(getRecipeById).toHaveBeenCalledWith(dummyRecipeId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(dummyRecipe);
	});

	it("should return 404 when the recipe ID does not exist", async () => {
		const dummyRecipeId = "nonexistent-recipe-id";
		(getRecipeById as jest.Mock).mockResolvedValue(null);

		const req = { params: { id: dummyRecipeId } } as unknown as Request;
		const res = mockResponse();

		await serializeRecipeById(req, res, mockNext);

		expect(getRecipeById).toHaveBeenCalledWith(dummyRecipeId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith({
			message: e.RECIPE_NOT_FOUND_ERROR,
		});
	});

	it("should call handleError on failure to retrieve the recipe", async () => {
		const dummyRecipeId = "recipe123";
		const mockError = new Error("Retrieval failed");
		(getRecipeById as jest.Mock).mockRejectedValue(mockError);

		const req = { params: { id: dummyRecipeId } } as unknown as Request;
		const res = mockResponse();

		await serializeRecipeById(req, res, mockNext);

		expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
	});
});
