import { Request, Response, NextFunction } from "express";
import { UserModel } from "../model";
import { checkUserDoesNotExist } from "../middleware";
import { handleError } from "../../utils/errorHandler";
import { ErrorMessages as e } from "../../consts";

jest.mock("../../utils/errorHandler");
jest.mock("../model");

describe("checkUserDoesNotExist Middleware", () => {
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

  it("should call next() if user does not exist", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    const req = {
      body: { email: "new@example.com" },
    } as Request;
    const res = mockResponse();

    await checkUserDoesNotExist(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 400 if user already exists", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      email: "existing@example.com",
    });
    const req = {
      body: { email: "existing@example.com" },
    } as Request;
    const res = mockResponse();

    await checkUserDoesNotExist(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: e.USER_ALREADY_EXISTS_ERROR,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Database error");
    (UserModel.findOne as jest.Mock).mockRejectedValue(mockError);
    const req = {
      body: { email: "error@example.com" },
    } as Request;
    const res = mockResponse();

    await checkUserDoesNotExist(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
