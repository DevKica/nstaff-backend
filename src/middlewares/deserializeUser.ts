import { omit } from "lodash";
import config from "config";
import COOKIE_TYPE from "../helpers/cookies/type";
import { NextFunction, Request, Response } from "express";
import { signJWT, verifyJWT } from "../utils/jwtConfig";
import { findSingleSession } from "../services/user/session.service";

const MAIN_SECRET_TOKEN = config.get<string>("MAIN_SECRET_TOKEN");
const ACCESS_TOKEN_TTL = config.get<string>("ACCESS_TOKEN_TTL");
const MAX_AGE_TOKEN_COOKIE = config.get<number>("MAX_AGE_TOKEN_COOKIE");

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    const { decoded: decodedAccess, expired: expiredAccess } = verifyJWT(accessToken, MAIN_SECRET_TOKEN);

    if (decodedAccess) {
        const session = await findSingleSession({ _id: decodedAccess.sessionId });
        if (!session || !session.valid) return next();
        res.locals.user = decodedAccess;
        return next();
    }

    if (expiredAccess && refreshToken) {
        const { decoded: decodedRefresh } = verifyJWT(refreshToken, MAIN_SECRET_TOKEN);
        if (!decodedRefresh) {
            res.clearCookie(COOKIE_TYPE.ACCESS_TOKEN);
            res.clearCookie(COOKIE_TYPE.REFRESH_TOKEN);
            return next();
        }
        if (!decodedRefresh.canRefresh) return next();

        const session = await findSingleSession({ _id: decodedRefresh.sessionId });
        if (!session || !session.valid) return next();

        const newAccessToken = signJWT({ ...omit(decodedRefresh, "exp", "iat", "canRefresh") }, MAIN_SECRET_TOKEN, ACCESS_TOKEN_TTL);

        res.cookie(COOKIE_TYPE.ACCESS_TOKEN, newAccessToken, { sameSite: "none", secure: true, httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });

        res.locals.user = verifyJWT(newAccessToken, MAIN_SECRET_TOKEN).decoded;

        return next();
    }
    return next();
};

export default deserializeUser;
