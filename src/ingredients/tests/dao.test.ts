import {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} from "../dao";
import { IngredientModel } from "../model";
import { dummyIngredient } from "./fixtures";

jest.mock("../model");

describe("createIngredient", () => {
  it("should create an ingredient and return it", async () => {
    (IngredientModel.prototype.save as jest.Mock).mockResolvedValue(
      dummyIngredient,
    );
    const ingredient = await createIngredient(dummyIngredient);
    expect(ingredient).toEqual(dummyIngredient);
  });

  it("should throw an error if saving the ingredient fails", async () => {
    const mockError = new Error("Database save error");
    (IngredientModel.prototype.save as jest.Mock).mockRejectedValue(mockError);
    await expect(createIngredient(dummyIngredient)).rejects.toThrow(mockError);
  });
});

describe("getAllIngredients", () => {
  it("should return all ingredients", async () => {
    (IngredientModel.find as jest.Mock).mockResolvedValue([dummyIngredient]);
    const ingredients = await getAllIngredients();
    expect(ingredients).toEqual([dummyIngredient]);
  });

  it("should throw an error if fetching ingredients fails", async () => {
    const mockError = new Error("Database find error");
    (IngredientModel.find as jest.Mock).mockRejectedValue(mockError);
    await expect(getAllIngredients()).rejects.toThrow(mockError);
  });
});

describe("getIngredientById", () => {
  it("should return an ingredient by id", async () => {
    (IngredientModel.findOne as jest.Mock).mockResolvedValue(dummyIngredient);
    const ingredient = await getIngredientById("1");
    expect(ingredient).toEqual(dummyIngredient);
  });

  it("should throw an error if ingredient not found", async () => {
    (IngredientModel.findOne as jest.Mock).mockResolvedValue(null);
    await expect(getIngredientById("nonexistent-id")).rejects.toThrow(
      "Ingredient not found",
    );
  });
});

describe("updateIngredient", () => {
  it("should update an ingredient and return the updated data", async () => {
    (IngredientModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      dummyIngredient,
    );
    const updatedIngredient = await updateIngredient("1", dummyIngredient);
    expect(updatedIngredient).toEqual(dummyIngredient);
  });

  it("should throw an error if ingredient not found", async () => {
    (IngredientModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(
      updateIngredient("nonexistent-id", dummyIngredient),
    ).rejects.toThrow("Ingredient not found");
  });
});

describe("deleteIngredient", () => {
  it("should delete an ingredient and return the result", async () => {
    (IngredientModel.deleteOne as jest.Mock).mockResolvedValue({
      deletedCount: 1,
    });
    const result = await deleteIngredient("1");
    expect(result).toEqual({ deletedCount: 1 });
  });

  it("should throw an error if ingredient not found", async () => {
    (IngredientModel.deleteOne as jest.Mock).mockResolvedValue({
      deletedCount: 0,
    });
    await expect(deleteIngredient("nonexistent-id")).rejects.toThrow(
      "Ingredient not found",
    );
  });
});
