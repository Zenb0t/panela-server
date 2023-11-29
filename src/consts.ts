export const USER_VALID_FIELDS = ["name", "email", "phone_number"];

// Error messages

export enum ErrorMessages {
    USER_NOT_FOUND_ERROR = "User not found",
    USER_NOT_CREATED_ERROR = "User not created",
    USER_NOT_UPDATED_ERROR = "User not updated",
    USER_NOT_DELETED_ERROR = "User not deleted",
    EMAIL_NOT_FOUND_ERROR = "Email not found",
    EMAIL_FORMAT_ERROR = "Email format is invalid",
    ROLE_CHANGE_NOT_ALLOWED_ERROR = "Changing role not allowed",
    INCOMPLETE_USER_DATA_ERROR = "User data is incomplete. Email and name are required.",
    PARAM_EMAIL_OR_ID_REQUIRED_ERROR = "Parameter email or id is required",
    USER_ALREADY_EXISTS_ERROR = "User already exists"
}
