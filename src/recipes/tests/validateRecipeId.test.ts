import { Request, Response, NextFunction } from 'express';
import { validadeRecipeId } from '../middleware';
import { handleError } from "../../utils/errorHandler";
import { validateId } from "../../utils/validation";

jest.mock('../../utils/errorHandler');
jest.mock('../../utils/validation');

describe('validadeRecipeId Middleware', () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  it('should call next for a valid recipe ID', async () => {
    const validRecipeId = 'validRecipeId123';
    const req = { params: { id: validRecipeId } } as unknown as Request;
    const res = mockResponse();

    await validadeRecipeId(req, res, mockNext);

    expect(validateId).toHaveBeenCalledWith(validRecipeId);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should call handleError for an invalid recipe ID', async () => {
    const invalidRecipeId = 'invalidId';
    const mockError = new Error('Invalid ID');
    (validateId as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    const req = { params: { id: invalidRecipeId } }  as unknown as Request;
    const res = mockResponse();

    await validadeRecipeId(req, res, mockNext);

    expect(validateId).toHaveBeenCalledWith(invalidRecipeId);
    expect(handleError).toHaveBeenCalledWith(mockError, req, res, mockNext);
  });
});
