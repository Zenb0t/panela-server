import { Request, Response, NextFunction } from "express";
import { validateUserData } from "../middleware";
import { ErrorMessages as e } from "../../consts";
import { Role } from "../../types/user";
import { ZodError } from "zod";

describe("validateUser Middleware", () => {
	// Mocking Express' response and next function
	const mockResponse = (): Response => {
		const res = {} as Response;
		res.status = jest.fn().mockReturnValue(res);
		res.send = jest.fn().mockReturnValue(res);
		return res;
	};

	const mockNext: NextFunction = jest.fn();

	const userData = {
		email: "email@example.com",
		name: "Test User",
		role: Role.USER,
	};

	it("should call next() for valid user data", async () => {
		const req = {
			body: {
				user: userData,
				role: Role.USER, // assuming Role.USER is a valid role
			},
		} as Request;

		const res = mockResponse();

		await validateUserData(req, res, mockNext);
		expect(mockNext).toHaveBeenCalled();
	});

	it("should return 400 for missing email", async () => {
		const req = {
			body: { user: { name: "Test User", role: "user" } },
		} as Request;

		const res = mockResponse();

		await validateUserData(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({
			message: e.INCOMPLETE_USER_DATA_ERROR,
			error: expect.any(Object), // Expecting some error object from Zod
		});
	});

	it("should return 400 for empty request body", async () => {
		const req = { body: {} } as Request;
		const res = mockResponse();

		await validateUserData(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({
			message: e.USER_DATA_REQUIRED_ERROR,
		});
	});

	it("should return 400 for invalid email", async () => {
		const req = {
			body: { user: { email: "test", name: "Test User", role: "user" } },
		} as Request;

		const res = mockResponse();

		await validateUserData(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({
			message: e.INCOMPLETE_USER_DATA_ERROR,
			error: expect.any(ZodError), // Expecting some error object from Zod
		});
	});
	
});
