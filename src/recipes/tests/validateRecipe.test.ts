import { Request, Response, NextFunction } from "express";
import { validateRecipe } from "../middleware";
import { dummyRecipe } from "./fixtures";

describe("validateRecipe Middleware", () => {
  // Mocking Express' response and next function
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it("should call next() for valid recipe data", async () => {
    const req = {
      body: dummyRecipe,
    } as Request;

    const res = mockResponse();

    await validateRecipe(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 400 and an error message for Zod validation failure", async () => {
    const invalidRecipe = { ...dummyRecipe, title: undefined };

    const req = { body: invalidRecipe } as Request;
    const res = mockResponse();

    await validateRecipe(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String), // Expect Zod's error message string
      })
    );
  });
});
