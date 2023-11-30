import { Request, Response, NextFunction } from 'express';
import { createNewRecipe } from '../middleware';
import { createRecipe } from '../dao';
import { dummyRecipe } from './fixtures';
import { handleError } from "../../utils/errorHandler";

jest.mock("../dao");
jest.mock("../../utils/errorHandler");

describe('createNewRecipe Middleware', () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it('should create a new recipe and send a 201 response', async () => {
    (createRecipe as jest.Mock).mockResolvedValue(dummyRecipe);

    const req = { body: dummyRecipe } as Request;
    const res = mockResponse();

    await createNewRecipe(req, res, mockNext);

    expect(createRecipe).toHaveBeenCalledWith(dummyRecipe);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(dummyRecipe);
  });

  it('should call handleError on recipe creation failure', async () => {
    const mockError = new Error('Creation failed');
    (createRecipe as jest.Mock).mockRejectedValue(mockError);
    const invalidRecipe = { ...dummyRecipe, title: undefined };

    const req = { body: invalidRecipe } as Request;
    const res = mockResponse();

    await createNewRecipe(req, res, mockNext);

    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);

  });

});
