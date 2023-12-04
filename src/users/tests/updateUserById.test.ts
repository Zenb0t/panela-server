import { Request, Response, NextFunction } from "express";
import { updateUserProfile } from "../dao";
import { updateUserById } from "../controller";
import { handleError } from "../../utils/errorHandler";
import { ErrorMessages as e } from "../../consts";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("updateUserById Middleware", () => {
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

	it("should successfully update a user", async () => {
		const mockUser = {
			id: "123",
			email: "test@example.com",
			name: "Updated User",
		};
		(updateUserProfile as jest.Mock).mockResolvedValue(mockUser);
		const req = {
			params: { id: "123" },
			body: { name: "Updated User" },
		} as unknown as Request;
		const res = mockResponse();

		await updateUserById(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(mockUser);
	});

	it("should return 404 if user not found", async () => {
		(updateUserProfile as jest.Mock).mockResolvedValue(null);
		const req = {
			params: { id: "non-existent-id" },
			body: { name: "New Name" },
		} as unknown as Request;
		const res = mockResponse();

		await updateUserById(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith({ message: e.USER_NOT_FOUND_ERROR });
	});

	it("should handle errors", async () => {
		const mockError = new Error("Update error");
		(updateUserProfile as jest.Mock).mockRejectedValue(mockError);
		const req = {
			params: { id: "123" },
			body: { name: "New Name" },
		} as unknown as Request;
		const res = mockResponse();

		await updateUserById(req, res, mockNext);

		expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
	});
});
