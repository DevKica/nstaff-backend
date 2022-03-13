import { Request, Response, NextFunction } from "express";

function trimmer(req: Request, res: Response, next: NextFunction) {
    Object.keys(req.body).map(function (key, _index) {
        if (typeof req.body[key] === "string") req.body[key] = req.body[key].trim();
    });
    next();
}

export default trimmer;
