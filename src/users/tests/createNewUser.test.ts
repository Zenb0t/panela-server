import { Request, Response, NextFunction } from "express";
import { createUser } from "../dao";
import { createNewUser } from "../controller";
import { handleError } from "../../utils/errorHandler";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("createNewUser Middleware", () => {
	const mockResponse = (): Response => {
		const res = {} as Response;
		res.status = jest.fn().mockReturnValue(res);
		res.send = jest.fn().mockReturnValue(res);
		return res;
	};

	const mockNext: NextFunction = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should create a new user and return 201 status", async () => {
		const userData = { email: "new@example.com", name: "New User" };
		(createUser as jest.Mock).mockResolvedValue(userData);
		const req = {
			body: { user: userData },
		} as Request;
		const res = mockResponse();

		await createNewUser(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith(userData);
	});

	it("should handle user creation failure", async () => {
		const mockError = new Error("User creation failed");
		(createUser as jest.Mock).mockRejectedValue(mockError);
		const req = {
			body: { user: { email: "fail@example.com", name: "Fail User" } },
		} as Request;
		const res = mockResponse();

		await createNewUser(req, res, mockNext);

		expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
	});
});
