import { Request, Response, NextFunction } from "express";
import { updateRecipeById } from "../controller";
import { updateRecipe } from "../dao";
import { handleError } from "../../utils/errorHandler";
import { ErrorMessages as e } from "../../consts";
import { dummyRecipe } from "./fixtures";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("updateRecipeById Middleware", () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it("should update a recipe and send a 200 response", async () => {
    const dummyRecipeId = "recipe123";
    const updatedRecipe = { ...dummyRecipe, title: "Updated Title" };
    (updateRecipe as jest.Mock).mockResolvedValue(updatedRecipe);

    const req = {
      params: { id: dummyRecipeId },
      body: { ...dummyRecipe, title: "Updated Title" },
    } as unknown as Request;
    const res = mockResponse();

    await updateRecipeById(req, res, mockNext);

    expect(updateRecipe).toHaveBeenCalledWith(dummyRecipeId, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(updatedRecipe);
  });

  it("should return 404 when the recipe ID does not exist", async () => {
    const dummyRecipeId = "nonexistent-recipe-id";
    (updateRecipe as jest.Mock).mockResolvedValue(null);

    const req = {
      params: { id: dummyRecipeId },
      body: { ...dummyRecipe, title: "Updated Title" },
    } as unknown as Request;
    const res = mockResponse();

    await updateRecipeById(req, res, mockNext);

    expect(updateRecipe).toHaveBeenCalledWith(dummyRecipeId, req.body);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: e.RECIPE_NOT_FOUND_ERROR,
    });
  });

  it("should call handleError on failure to update the recipe", async () => {
    const dummyRecipeId = "recipe123";
    const mockError = new Error("Update failed");
    (updateRecipe as jest.Mock).mockRejectedValue(mockError);

    const req = {
      params: { id: dummyRecipeId },
      body: { ...dummyRecipe, title: "Updated Title" },
    } as unknown as Request;
    const res = mockResponse();

    await updateRecipeById(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });

});
