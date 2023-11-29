import { Request, Response, NextFunction } from "express";
import { UserModel } from "../model";
import { checkUserExists } from "../middleware";
import { handleError } from "../../utils/errorHandler";
import { ErrorMessages as e } from "../../consts";

jest.mock("../../utils/errorHandler");
jest.mock("../model");

describe("checkUserExists Middleware", () => {
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

  it("should call next() if user exists", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: "existing@example.com" });
    const req = {
      params: { email: "existing@email.com" },
        body: {}
    } as unknown as Request;
    const res = mockResponse();

    await checkUserExists(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.body.user).toEqual({ email: "existing@example.com" });
  });

  it("should return 404 if user does not exist", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    const req = {
      params: { email: "nonexistent@example.com" },
      body: {}
    } as unknown as Request;
    const res = mockResponse();

    await checkUserExists(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: e.USER_NOT_FOUND_ERROR });
  });

  it("should return 400 if no email or id provided", async () => {
    const req = { params: {}, body: {} } as Request;
    const res = mockResponse();

    await checkUserExists(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: e.PARAM_EMAIL_OR_ID_REQUIRED_ERROR });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Database error");
    (UserModel.findOne as jest.Mock).mockRejectedValue(mockError);
    const req = {
      params: { email: "error@example.com" },
      body: {}
    } as unknown as Request;
    const res = mockResponse();

    await checkUserExists(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
