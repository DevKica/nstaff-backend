import Joi from "joi";
import { emailSchema, passwordCheck } from "./user.schema";

export const loginSchema = Joi.object({
    ...emailSchema,
    ...passwordCheck,
});

export type loginInputSchema = typeof loginSchema;
