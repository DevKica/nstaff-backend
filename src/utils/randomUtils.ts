import { Request, Response } from "express";
import { TOO_MANY_REQUEST } from "../helpers/errors/errorMessages";

export function tooManyRequestHandler(_:Request,res:Response){
    return res.send(TOO_MANY_REQUEST)
}