import { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../dao";
import { serializeUserByEmail } from "../controller";
import { handleError } from "../../utils/errorHandler";
import { ErrorMessages as e } from "../../consts";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("serializeUserByEmail Middleware", () => {
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

	it("should send user data for a valid email", async () => {
		const mockUser = {
			id: "123",
			email: "test@example.com",
			name: "Test User",
		};
		(getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
		const req = {
			params: { id: "123" },
		} as unknown as Request;
		const res = mockResponse();

		await serializeUserByEmail(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(mockUser);
	});

	it("should return 404 for a non-existent user email", async () => {
		(getUserByEmail as jest.Mock).mockResolvedValue(null);
		const req = {
			params: { id: "non-existent-id" },
		} as unknown as Request;
		const res = mockResponse();

		await serializeUserByEmail(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith({
			message: e.USER_NOT_FOUND_ERROR,
		});
	});

	it("should handle errors", async () => {
		const mockError = new Error("Database error");
		(getUserByEmail as jest.Mock).mockRejectedValue(mockError);
		const req = {
			params: { id: "error-id" },
		} as unknown as Request;
		const res = mockResponse();

		await serializeUserByEmail(req, res, mockNext);

		expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
	});
});
