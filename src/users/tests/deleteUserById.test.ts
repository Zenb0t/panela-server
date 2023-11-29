import { Request, Response, NextFunction } from "express";
import { deleteUser } from "../dao";
import { deleteUserById } from "../middleware";
import { handleError } from "../../utils/errorHandler";
import { ErrorMessages as e } from "../../consts";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("deleteUserById Middleware", () => {
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

  it("should successfully delete a user", async () => {
    const deleteResponse = { acknowledged: true, deletedCount: 1 };
    (deleteUser as jest.Mock).mockResolvedValue(deleteResponse);
    const req = {
      params: { id: "123" },
    } as unknown as Request;
    const res = mockResponse();
  
    await deleteUserById(req, res, mockNext);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(deleteResponse);
  });

  it("should return 404 if user to delete is not found", async () => {
    (deleteUser as jest.Mock).mockResolvedValue(null);
    const req = {
      params: { id: "non-existent-id" },
    } as unknown as Request;
    const res = mockResponse();

    await deleteUserById(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: e.USER_NOT_DELETED_ERROR,
    });
  });

  it("should handle errors during deletion", async () => {
    const mockError = new Error("Deletion error");
    (deleteUser as jest.Mock).mockRejectedValue(mockError);
    const req = {
      params: { id: "123" },
    } as unknown as Request;
    const res = mockResponse();

    await deleteUserById(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
