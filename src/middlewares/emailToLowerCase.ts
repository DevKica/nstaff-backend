import { Request,Response,NextFunction } from "express";

export const emailToLowerCase = (req:Request,_:Response,next:NextFunction) =>{
    if(req.body.email){
        req.body.email = req.body.email.toLowerCase()
    }
    return next()
}
