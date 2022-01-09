import { messageFormat } from "./messageFormat";

export const SUCCESS_DATA = (data: any) => messageFormat(data, 200);

export const BAD_REQUEST = messageFormat("Bad request", 400);

export const NOT_FOUND = messageFormat("Not found", 404);

export const FORBIDDEN = messageFormat("Forbidden", 403);

export const SUCCESS = messageFormat("Success", 200);

export const INVALID_LOGIN_CREDENTIALS_ERROR = messageFormat("Invalid email or password", 401);

export const INPUT_EMAIL_EXIST = messageFormat("Email is already in the database", 400);

export const INVALID_OLD_PASSWORD = messageFormat("Old password is not correct", 400);

export const CONFIRM_EMAIL = messageFormat("We have sent a message to your mail, please confirm it", 403);

export const SERVER_ERROR = messageFormat("Server error", 500);

export const INVALID_PASSWORD = messageFormat("Invalid password", 403);

export const EMAIL_CONFIRMATION_EXPIRED = messageFormat("Confirmation of e-mail address has expired", 400);

export const EXPIRED_LINK = messageFormat("This link has expired", 400);

export const EMAIL_NOT_FOUND = messageFormat("Email not found, try again", 400);

export const UNACTIVE_LINK = messageFormat("This link isnt active more", 400);

export const TOKEN_EXPIRED = messageFormat("Token expired, you have to log in again", 400);

export const PHOTO_REQUIRED = messageFormat("Photo is required", 400);

export const INVALID_FILE_FORMAT = messageFormat("Invalid file format", 400);

export const GOOGLE_REGISTER = messageFormat("If you want to register, you have to create password", 400);

export const TOO_MANY_REQUEST = messageFormat("Too many request, try again later", 400);

export const MONTHLY_RATE__DOES_NOT_EXISTS = messageFormat("You cant work day without monthly rate", 400);

export const MONTHLY_RATE_EXISTS = messageFormat("You cant create monthly rate that already exists", 400);

export const WORK_DAY_EXISTS = messageFormat("You cant create work day that already exists", 400);
