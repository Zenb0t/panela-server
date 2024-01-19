import { Request, Response, NextFunction } from "express";
import { defaultRoleMiddleware, validateRoleMiddleware } from "../middleware";
import { ErrorMessages as e } from "../../consts";
import { Role } from "../../types/user";

describe("Validate User Roles Middleware", () => {
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

	it("should return 401 for unauthorized role change", async () => {
		const req = {
			body: {
				user: { ...userData, role: Role.ADMIN },
				role: Role.USER,
			},
		} as Request;

		const res = mockResponse();
		console.log(req.body);
		const result = await validateRoleMiddleware(req, res, mockNext);
		console.log(result);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.send).toHaveBeenCalledWith({
			message: e.ROLE_CHANGE_NOT_ALLOWED_ERROR,
		});
	});

	it("should return 400 for invalid role", async () => {
		const req = {
			body: {
				user: {
					email: "test@example.com",
					name: "Test User",
					role: Role.USER,
				},
				role: "escalated-role",
			},
		} as Request;

		const res = mockResponse();

		await validateRoleMiddleware(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({
			message: e.ROLE_INVALID_ERROR,
		});
	});
});
