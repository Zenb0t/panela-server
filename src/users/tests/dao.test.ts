import { createUser, deleteUser, getUserByEmail, getUserById, updateUserProfile } from "../dao"; 
import { UserModel } from "../model"; 
import { Role, User } from "../../types/user";
import { ErrorMessages as e } from "../../consts";

jest.mock("../model");

const mockUser = { _id: '123', email: 'test@example.com' };
const mockUserData = { email: 'test@example.com', name: 'Test User' };

describe('createUser Function', () => {
  it('successfully creates a user', async () => {
    (UserModel.prototype.save as jest.Mock).mockResolvedValue(mockUserData);

    const result = await createUser(mockUserData as User);

    expect(UserModel.prototype.save).toHaveBeenCalled();
    expect(result).toEqual(mockUserData);
  });

  it('throws an error when user creation fails', async () => {
    const mockError = new Error('Save failed');
    (UserModel.prototype.save as jest.Mock).mockRejectedValue(mockError);

    await expect(createUser(mockUserData as User)).rejects.toThrow(mockError);
  });
});

describe('getUserById Function', () => {
  it('retrieves a user by id', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserById('123');

    expect(UserModel.findOne).toHaveBeenCalledWith({ _id: '123' });
    expect(result).toEqual(mockUser);
  });

  it('throws an error when user not found', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getUserById('nonexistent-id')).rejects.toThrow(e.USER_NOT_FOUND_ERROR);
  });
});

describe('getUserByEmail Function', () => {
  it('retrieves a user by email', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserByEmail('test@example.com');

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toEqual(mockUser);
  });

  it('throws an error when user not found', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getUserByEmail('nonexistent-id')).rejects.toThrow(e.USER_NOT_FOUND_ERROR);
  });
});


describe("updateUserProfile Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update a user", async () => {
    const mockUser: User = {
      _id: "123",
      email: "test@example.com",
      name: "Test User",
      email_verified: false,
      role: Role.USER,
    };
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);
    const updatedUserData: User = {
      _id: "123",
      email: "test@example.com",
      name: "Test User",
      email_verified: false,
      role: Role.USER,
      phone_number: "1234567890",
    };

    const result = await updateUserProfile("123", updatedUserData);

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "123" },
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
          _id: "456",
          email: "test@example.com",
          email_verified: false,
          role: Role.USER,
      })
    ).rejects.toThrow(e.USER_NOT_FOUND_ERROR);
  });

  it("should handle database errors", async () => {
    const mockError = new Error("Database error");
    (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(mockError);

    await expect(
      updateUserProfile("123", {
          name: "New Name",
          _id: "",
          email: "",
          email_verified: false,
          role: Role.USER,
      })
    ).rejects.toThrow(mockError);
  });
});

describe('deleteUser Function', () => {
  it('successfully deletes a user', async () => {
    const deleteResponse = { acknowledged: true, deletedCount: 1 };
    (UserModel.deleteOne as jest.Mock).mockResolvedValue(deleteResponse);

    const result = await deleteUser('123');

    expect(UserModel.deleteOne).toHaveBeenCalledWith({ _id: '123' });
    expect(result).toEqual(deleteResponse);
  });

  it('throws an error when user deletion fails', async () => {
    (UserModel.deleteOne as jest.Mock).mockResolvedValue({ acknowledged: true, deletedCount: 0 });

    await expect(deleteUser('nonexistent-id')).rejects.toThrow(e.USER_NOT_FOUND_ERROR);
  });
});
