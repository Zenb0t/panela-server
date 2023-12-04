import { Request, Response, NextFunction } from "express";
import { createNewIngredient } from "../controller";
import { createIngredient } from "../dao";
import { dummyIngredient } from "./fixtures";
import { handleError } from "../../utils/errorHandler";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe("createNewIngredient Middleware", () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it("should create a new ingredient and send a 201 response", async () => {
    (createIngredient as jest.Mock).mockResolvedValue(dummyIngredient);

    const req = { body: dummyIngredient } as Request;
    const res = mockResponse();

    await createNewIngredient(req, res, mockNext);

    expect(createIngredient).toHaveBeenCalledWith(dummyIngredient);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(dummyIngredient);
  });

  it("should call handleError on ingredient creation failure", async () => {
    const mockError = new Error("Creation failed");
    (createIngredient as jest.Mock).mockRejectedValue(mockError);
    const invalidIngredient = { ...dummyIngredient, name: undefined };

    const req = { body: invalidIngredient } as Request;
    const res = mockResponse();

    await createNewIngredient(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
