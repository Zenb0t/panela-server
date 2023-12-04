import { Request, Response, NextFunction } from "express";
import { deleteRecipeById } from "../controller";
import { deleteRecipe } from "../dao";
import { handleError } from "../../utils/errorHandler";
import { ErrorMessages as e } from "../../consts";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("deleteRecipeById Middleware", () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it("should delete a recipe and send a 200 response", async () => {
    const dummyRecipeId = "recipe123";
    const deletionResult = { acknowledged: true, deletedCount: 1 }; // Simulating MongoDB delete response
    (deleteRecipe as jest.Mock).mockResolvedValue(deletionResult);

    const req = { params: { id: dummyRecipeId } } as unknown as Request;
    const res = mockResponse();

    await deleteRecipeById(req, res, mockNext);

    expect(deleteRecipe).toHaveBeenCalledWith(dummyRecipeId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(deletionResult);
  });

  it("should return 404 when the recipe ID does not exist", async () => {
    const dummyRecipeId = "nonexistent-recipe-id";
    const deletionResult = { acknowledged: true, deletedCount: 0 }; // No recipe deleted
    (deleteRecipe as jest.Mock).mockResolvedValue(deletionResult);

    const req = { params: { id: dummyRecipeId } } as unknown as Request;
    const res = mockResponse();

    await deleteRecipeById(req, res, mockNext);

    expect(deleteRecipe).toHaveBeenCalledWith(dummyRecipeId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: e.RECIPE_NOT_DELETED_ERROR,
    });
  });

  it("should call handleError on failure to delete the recipe", async () => {
    const dummyRecipeId = "recipe123";
    const mockError = new Error("Deletion failed");
    (deleteRecipe as jest.Mock).mockRejectedValue(mockError);

    const req = { params: { id: dummyRecipeId } } as unknown as Request;
    const res = mockResponse();

    await deleteRecipeById(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
