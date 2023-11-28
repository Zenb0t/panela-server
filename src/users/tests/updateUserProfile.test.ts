import { updateUserProfile } from "../dao"; 
import { UserModel } from "../model"; 
import { User } from "../model"; 
import { errorMessages as e } from "../../consts";

jest.mock("../model");

describe("updateUserProfile Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update a user", async () => {
    const mockUser: User = {
      id: "123",
      email: "test@example.com",
      name: "Test User",
      email_verified: false,
      role: "user",
    };
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);
    const updatedUserData: User = {
      id: "123",
      email: "test@example.com",
      name: "Test User",
      email_verified: false,
      role: "user",
      phone_number: "1234567890",
    };

    const result = await updateUserProfile("123", updatedUserData);

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "123" },
      updatedUserData,
      { new: true }
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw an error if user not found", async () => {
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      updateUserProfile("nonexistent-id", {
          name: "New Name",
          id: "456",
          email: "test@example.com",
          email_verified: false,
          role: "user"
      })
    ).rejects.toThrow(e.USER_NOT_FOUND_ERROR);
  });

  it("should handle database errors", async () => {
    const mockError = new Error("Database error");
    (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(mockError);

    await expect(
      updateUserProfile("123", {
          name: "New Name",
          id: "",
          email: "",
          email_verified: false,
          role: ""
      })
    ).rejects.toThrow(mockError);
  });
});
