import { Request, Response, NextFunction } from "express";
import { serializeAllRecipes } from "../controller";
import { getAllRecipes } from "../dao";
import { handleError } from "../../utils/errorHandler";
import { dummyRecipeList } from "./fixtures";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("serializeAllRecipes Middleware", () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it("should retrieve all recipes and send a 200 response", async () => {
    (getAllRecipes as jest.Mock).mockResolvedValue(dummyRecipeList);

    const req = {} as Request;
    const res = mockResponse();

    await serializeAllRecipes(req, res, mockNext);

    expect(getAllRecipes).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(dummyRecipeList);
  });

  it("should call handleError on failure to retrieve recipes", async () => {
    const mockError = new Error("Retrieval failed");
    (getAllRecipes as jest.Mock).mockRejectedValue(mockError);

    const req = {} as Request;
    const res = mockResponse();

    await serializeAllRecipes(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
