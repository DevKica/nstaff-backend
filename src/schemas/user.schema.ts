import { matchError } from "./betterJoiMessage";

const Joi = require("joi").extend(require("@joi/date"));

const generalInfoSchema = {
    name: Joi.string().pattern(new RegExp(`^[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż]{2,30}$`)).required().label("Name").messages({
        "string.pattern.base": "{#label} should contain only letters and be at least 2 characters long and maximum 30",
    }),
    surname: Joi.string().pattern(new RegExp("^[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż]{2,50}$")).required().label("Surname").messages({
        "string.pattern.base": "{#label} should contain only letters and be at least 2 characters long and maximum 50",
    }),
};

export const passwordCheck = {
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,48}$")).required().label("Password").messages({
        "string.pattern.base": "{#label} should contain only letters and numbers and be at least 8 characters long and maximum 48",
    }),
};

export const passwordCheckSchema = Joi.object({
    ...passwordCheck,
});

export const passwordsSchema = {
    ...passwordCheck,
    repeatPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .label("Repeat password")
        .messages({
            "any.only": matchError(`"Passwords"`),
        }),
};

export const multiPasswordsCheckSchema = Joi.object(passwordsSchema);

export const emailSchema = {
    email: Joi.string().email({ minDomainSegments: 2 }).required().label("Email"),
};

export const setNewPasswordSchema = Joi.object({
    ...passwordsSchema,
});

export const checkEmailSchema = Joi.object({
    ...emailSchema,
});

export const createUserSchema = Joi.object({
    ...emailSchema,
    ...passwordsSchema,
    ...generalInfoSchema,
});

export const generalUserSchema = Joi.object({
    ...generalInfoSchema,
});

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string(),
    ...passwordsSchema,
});

export const validatePasswordSchema = Joi.object({
    ...passwordCheck,
});

export const validateEmailSchema = Joi.object({
    ...emailSchema,
});
