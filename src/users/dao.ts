import { User, UserModel } from "./model";
import { errorMessages as e } from "../consts";

/**
 * Creates a new user in the database.
 * @param {User} userData - Data for creating a new user.
 * @returns {Promise<Object>} The created user data.
 * @throws {Error} Throws an error if the user cannot be saved.
 */
export const createUser = async (userData: User) => {
  try {
    const user = new UserModel(userData);
    user.id = user._id;

    // Save the user to the database
    const savedUser = await user.save();

    // Return the saved user data
    return savedUser;
  } catch (err) {
    throw err;
  }
};

/**
 * Get a user by id.
 * @param {string} id - The id of the user to get.
 * @returns {Promise<Object>} The user data.
 * @throws {Error} Throws an error if the user cannot be found.
 */
export const getUserById = async (id: string) => {
  try {
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      throw new Error(e.USER_NOT_FOUND_ERROR);
    }
    return user;
  } catch (err) {
    throw err;
  }
};

/**
 * Get a user by email.
 * @param {string} email - The email of the user to get.
 * @returns {Promise<Object>} The user data.
 * @throws {Error} Throws an error if the user cannot be found.
 */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error(e.USER_NOT_FOUND_ERROR);
    }
    return user;
  } catch (err) {
    throw err;
  }
};

/***
 * Update a user by id
 * @param {string} id - The id of the user to update.
 * @param {User} userData - The data to update the user with.
 * @returns {Promise<Object>} The updated user data.
 * @throws {Error} Throws an error if the user cannot be updated.
 */
export const updateUserProfile = async (id: string, userData: User) => {
  try {
    const user = await UserModel.findOneAndUpdate({ id: id }, userData, {
      new: true,
    });
    if (!user) {
      throw new Error(e.USER_NOT_FOUND_ERROR);
    }
    return user;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete a user by id.
 * @param {string} id - The id of the user to delete.
 * @returns {Promise<Object>} The deleted user data.
 * @throws {Error} Throws an error if the user cannot be deleted.
 */
export const deleteUser = async (id: string) => {
  try {
    const result = await UserModel.deleteOne({ id: id });
    if (result.deletedCount === 0) {
      throw new Error(e.USER_NOT_FOUND_ERROR);
    }
    return result;
  } catch (err) {
    throw err;
  }
};
