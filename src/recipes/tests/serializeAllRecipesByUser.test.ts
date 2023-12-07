import { Request, Response, NextFunction } from "express";
import { serializeAllRecipesByUser } from "../controller";
import { getAllRecipesByUserId } from "../dao";
import { handleError } from "../../utils/errorHandler";
import { dummyRecipeList } from "./fixtures";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("serializeAllRecipesByUser Middleware", () => {
	const mockResponse = (): Response => {
		const res = {} as Response;
		res.status = jest.fn().mockReturnValue(res);
		res.send = jest.fn().mockReturnValue(res);
		return res;
	};

	const mockNext: NextFunction = jest.fn();

	it("should retrieve all recipes for a user and send a 200 response", async () => {
		const dummyUserId = "123";
		(getAllRecipesByUserId as jest.Mock).mockResolvedValue(dummyRecipeList);

		const req = { params: { userId: dummyUserId } } as unknown as Request;
		const res = mockResponse();

		await serializeAllRecipesByUser(req, res, mockNext);

		expect(getAllRecipesByUserId).toHaveBeenCalledWith(dummyUserId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(dummyRecipeList);
	});

	it("should call handleError on failure to retrieve recipes", async () => {
		const mockError = new Error("Retrieval failed");
		const dummyUserId = "123";
		(getAllRecipesByUserId as jest.Mock).mockRejectedValue(mockError);

		const req = { params: { userId: dummyUserId } } as unknown as Request;
		const res = mockResponse();

		await serializeAllRecipesByUser(req, res, mockNext);

		expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
	});

	it("should handle a user with no recipes", async () => {
		const dummyUserId = "user-with-no-recipes";
		(getAllRecipesByUserId as jest.Mock).mockResolvedValue([]);

		const req = { params: { userId: dummyUserId } } as unknown as Request;
		const res = mockResponse();

		await serializeAllRecipesByUser(req, res, mockNext);

		expect(getAllRecipesByUserId).toHaveBeenCalledWith(dummyUserId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith([]);
	});
});
