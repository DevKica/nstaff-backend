import config from "config";
import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { FORBIDDEN } from "../helpers/errors/errorMessages";
const GOOGLE_CLIENT_ID = config.get<string>("GOOGLE_CLIENT_ID");

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function googleDeserialize(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) throw Error;

        const { email, given_name, family_name } = payload;

        if (!(given_name && family_name && email)) throw Error;

        res.locals.googleData = { email, name: family_name, surname: given_name, password };

        return next();
    } catch (e: unknown) {
        return res.send(FORBIDDEN);
    }
}
