import { Request, Response, NextFunction } from "express";
import { validateUserData } from "../middleware";
import { ErrorMessages as e } from "../../consts";
import { Role } from "../../types/user";

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
      body: userData,
    } as Request;

    const res = mockResponse();

    await validateUserData(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 400 for missing email", async () => {
    const req = {
      body: { name: "Test User", role: "user" },
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
      message: e.INCOMPLETE_USER_DATA_ERROR,
      error: expect.any(Object), // Expecting some error object from Zod
    });
  });

  it("should return 400 for invalid email", async () => {
    const req = {
      body: { email: "test", name: "Test User", role: "user" },
    } as Request;

    const res = mockResponse();

    await validateUserData(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: e.INCOMPLETE_USER_DATA_ERROR,
      error: expect.any(Object), // Expecting some error object from Zod
    });
  });

  it("should return 401 for unauthorized role change", async () => {
    const req = {
      body: {
        email: "test@example.com",
        name: "Test User",
        role: Role.ADMIN,
        user: userData,
      },
    } as Request;

    const res = mockResponse();

    await validateUserData(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: e.ROLE_CHANGE_NOT_ALLOWED_ERROR,
    });
  });

  it("should return 400 for invalid role", async () => {
    const req = {
      body: {
        email: "test@example.com",
        name: "Test User",
        role: "escalated-role",
      },
    } as Request;

    const res = mockResponse();

    await validateUserData(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: e.ROLE_INVALID_ERROR,
    });
  });
});
