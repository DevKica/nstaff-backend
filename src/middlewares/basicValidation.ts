import { Request, Response, NextFunction } from "express";
import { messageFormat } from "../helpers/errors/messageFormat";
import errorsHandler from "../helpers/errors/errorHandler";

export const schemaValidation = (schema: any, objToValidate: Object) => {
    const error = schema.validate(objToValidate, { abortEarly: false }).error;
    if (error) {
        const respond = errorsHandler(error.details);
        return respond;
    }
    return false;
};

export const basicSchemaValidation = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    const error = schemaValidation(schema, req.body);
    if (error) {
        return res.send(messageFormat(error, 400));
    }
    next();
};
