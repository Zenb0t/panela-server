export const USER_VALID_FIELDS = ["name", "email", "phone_number"];

// Error messages

export enum ErrorMessages {
    // General
    ID_NOT_PROVIDED_ERROR = "Id not provided",
    ID_INVALID_ERROR = "Id is invalid",
    ROLE_NOT_PROVIDED_ERROR = "Role not provided",
    ROLE_INVALID_ERROR = "Role is invalid",
    // User
    USER_NOT_FOUND_ERROR = "User not found",
    USER_NOT_CREATED_ERROR = "User not created",
    USER_NOT_UPDATED_ERROR = "User not updated",
    USER_NOT_DELETED_ERROR = "User not deleted",
    EMAIL_NOT_FOUND_ERROR = "Email not found",
    EMAIL_FORMAT_ERROR = "email: Invalid email address",
    ROLE_CHANGE_NOT_ALLOWED_ERROR = "Changing role not allowed",
    INCOMPLETE_USER_DATA_ERROR = "User data is incomplete. Email and name are required.",
    PARAM_EMAIL_OR_ID_REQUIRED_ERROR = "Parameter email or id is required",
    USER_ALREADY_EXISTS_ERROR = "User already exists",
    // Recipe
    RECIPE_NOT_FOUND_ERROR = "Recipe not found",
    RECIPE_NOT_CREATED_ERROR = "Recipe not created",
    RECIPE_NOT_UPDATED_ERROR = "Recipe not updated",
    RECIPE_NOT_DELETED_ERROR = "Recipe not deleted",
    // Ingredient
    INGREDIENT_NOT_FOUND_ERROR = "Ingredient not found",
    INGREDIENT_NOT_CREATED_ERROR = "Ingredient not created",
    INGREDIENT_NOT_UPDATED_ERROR = "Ingredient not updated",
    INGREDIENT_NOT_DELETED_ERROR = "Ingredient not deleted",
}
