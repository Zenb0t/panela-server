import { Request, Response, NextFunction } from "express";
import { serializeIngredientById } from "../controller";
import { getIngredientById } from "../dao";
import { dummyIngredient } from "./fixtures"; // Ensure this is a single ingredient fixture
import { handleError } from "../../utils/errorHandler";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("serializeIngredientById Middleware", () => {
	const mockResponse = (): Response => {
		const res = {} as Response;
		res.status = jest.fn().mockReturnValue(res);
		res.send = jest.fn().mockReturnValue(res);
		return res;
	};

	const mockNext: NextFunction = jest.fn();

	it("should retrieve an ingredient by ID and send a 200 response", async () => {
		const ingredientId = dummyIngredient._id;
		(getIngredientById as jest.Mock).mockResolvedValue(dummyIngredient);

		const req = { params: { id: ingredientId } } as unknown as Request;
		const res = mockResponse();

		await serializeIngredientById(req, res, mockNext);

		expect(getIngredientById).toHaveBeenCalledWith(ingredientId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(dummyIngredient);
	});

	it("should call handleError when the ingredient is not found", async () => {
		const mockError = new Error("Ingredient not found");
		(getIngredientById as jest.Mock).mockRejectedValue(mockError);

		const req = { params: { id: "nonexistent-id" } } as unknown as Request;
		const res = mockResponse();

		await serializeIngredientById(req, res, mockNext);

		expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
	});
});
