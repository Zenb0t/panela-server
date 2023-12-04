import { Request, Response, NextFunction } from "express";
import { updateIngredientById } from "../controller";
import { updateIngredient } from "../dao";
import { dummyIngredient } from "./fixtures"; // Ensure these fixtures are defined
import { handleError } from "../../utils/errorHandler";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");
const updatedIngredientData = {
	...dummyIngredient,
	name: "Updated Flour",
};

describe("updateIngredientById Middleware", () => {
	const mockResponse = (): Response => {
		const res = {} as Response;
		res.status = jest.fn().mockReturnValue(res);
		res.send = jest.fn().mockReturnValue(res);
		return res;
	};

	const mockNext: NextFunction = jest.fn();

	it("should update an ingredient and send a 200 response", async () => {
		const ingredientId = dummyIngredient._id;
		(updateIngredient as jest.Mock).mockResolvedValue(dummyIngredient);

		const req = {
			params: { id: ingredientId },
			body: updatedIngredientData,
		} as unknown as Request;
		const res = mockResponse();

		await updateIngredientById(req, res, mockNext);

		expect(updateIngredient).toHaveBeenCalledWith(
			ingredientId,
			updatedIngredientData
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(dummyIngredient);
	});

	it("should call handleError when the update fails", async () => {
		const mockError = new Error("Update failed");
		(updateIngredient as jest.Mock).mockRejectedValue(mockError);

		const req = {
			params: { id: dummyIngredient._id },
			body: updatedIngredientData,
		} as unknown as Request;
		const res = mockResponse();

		await updateIngredientById(req, res, mockNext);

		expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
	});
});
