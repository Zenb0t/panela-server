import { Request, Response, NextFunction } from "express";
import { serializeAllIngredients } from "../controller";
import { getAllIngredients } from "../dao";
import { dummyIngredients } from "./fixtures"; // Ensure this array of ingredients is defined
import { handleError } from "../../utils/errorHandler";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("serializeAllIngredients Middleware", () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();
  const mockRequest = {} as Request; // Assuming no specific request parameters are needed

  it("should retrieve all ingredients and send a 200 response", async () => {
    (getAllIngredients as jest.Mock).mockResolvedValue(dummyIngredients);

    const req = mockRequest;
    const res = mockResponse();

    await serializeAllIngredients(req, res, mockNext);

    expect(getAllIngredients).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(dummyIngredients);
  });

  it("should call handleError on failure to retrieve ingredients", async () => {
    const mockError = new Error("Fetch failed");
    (getAllIngredients as jest.Mock).mockRejectedValue(mockError);

    const req = mockRequest;
    const res = mockResponse();

    await serializeAllIngredients(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
