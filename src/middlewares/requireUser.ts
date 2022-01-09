import { Request, Response, NextFunction } from "express";
import { CONFIRM_EMAIL, FORBIDDEN } from "../helpers/errors/errorMessages";

export const requireActiveUser = (_: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) return res.send(FORBIDDEN);

    if (!user.active) return res.send(CONFIRM_EMAIL);

    return next();
};

export const requireUser = (_: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) return res.send(FORBIDDEN);

    return next();
};
