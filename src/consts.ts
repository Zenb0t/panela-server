export const USER_VALID_FIELDS = ["name", "email", "phone_number"];

// Error messages

const USER_NOT_FOUND_ERROR = "User not found";
const USER_NOT_CREATED_ERROR = "User not created";
const USER_NOT_UPDATED_ERROR = "User not updated";
const USER_NOT_DELETED_ERROR = "User not deleted";
const EMAIL_NOT_FOUND_ERROR = "Email not found";
const EMAIL_FORMAT_ERROR = "Email format is invalid";
const ROLE_CHANGE_NOT_ALLOWED_ERROR = "Changing role not allowed";
const INCOMPLETE_USER_DATA_ERROR =
  "User data is incomplete. Email and name are required.";
const PARAM_EMAIL_OR_ID_REQUIRED_ERROR = "Parameter email or id is required";
const USER_ALREADY_EXISTS_ERROR = "User already exists";

export const errorMessages = {
  USER_NOT_FOUND_ERROR,
  USER_NOT_CREATED_ERROR,
  USER_NOT_UPDATED_ERROR,
  USER_NOT_DELETED_ERROR,
  EMAIL_NOT_FOUND_ERROR,
  EMAIL_FORMAT_ERROR,
  ROLE_CHANGE_NOT_ALLOWED_ERROR,
  INCOMPLETE_USER_DATA_ERROR,
  PARAM_EMAIL_OR_ID_REQUIRED_ERROR,
  USER_ALREADY_EXISTS_ERROR,
};
