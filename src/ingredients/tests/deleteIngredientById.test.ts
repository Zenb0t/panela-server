import { Request, Response, NextFunction } from "express";
import { deleteIngredientById } from "../controller";
import { deleteIngredient } from "../dao";
import { handleError } from "../../utils/errorHandler";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("deleteIngredientById Middleware", () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it("should delete an ingredient and send a 200 response", async () => {
    (deleteIngredient as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockResponse();

    await deleteIngredientById(req, res, mockNext);

    expect(deleteIngredient).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ deletedCount: 1 });
  });

  it("should call handleError when the deletion fails", async () => {
    const mockError = new Error("Deletion failed");
    (deleteIngredient as jest.Mock).mockRejectedValue(mockError);

    const req = { params: { id: "nonexistent-id" } } as unknown as Request;
    const res = mockResponse();

    await deleteIngredientById(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
