import config from "config";
import { omit } from "lodash";
import { Request, Response } from "express";
import COOKIE_TYPE from "../../helpers/cookies/type";
import { deleteEmailConfirmation } from "../../services/user/emailConfirmation.service";
import { signNewSession, updateManySessions } from "../../services/user/session.service";
import { checkIfEmailExists, createUser, getUser, updateUser } from "../../services/user/user.service";
import { FORBIDDEN, GOOGLE_REGISTER, INPUT_EMAIL_EXIST, SERVER_ERROR } from "../../helpers/errors/errorMessages";
import { SUCCESS_USER_FORMAT } from "../../helpers/errors/returnUserData";

const MAX_AGE_TOKEN_COOKIE = config.get<number>("MAX_AGE_TOKEN_COOKIE");

export async function googleRegisterHandler(req: Request, res: Response) {
    try {
        const emailExists = await checkIfEmailExists(res.locals.googleData.email);

        if (emailExists) return res.send(INPUT_EMAIL_EXIST);

        const user = await createUser({ ...res.locals.googleData, active: true });

        if (!user) throw Error;

        const tokens = await signNewSession({ ...user, userAgent: req.get("user-agent") || "" });

        if (!tokens) throw Error;

        res.cookie(COOKIE_TYPE.ACCESS_TOKEN, tokens.accessToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });
        res.cookie(COOKIE_TYPE.REFRESH_TOKEN, tokens.refreshToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });

        return res.send(SUCCESS_USER_FORMAT(user));
    } catch (e) {
        return res.send(FORBIDDEN);
    }
}

export async function googleLoginHandler(req: Request, res: Response) {
    try {
        const { email } = res.locals.googleData;

        let user = await getUser({ email });

        if (!user) return res.send(GOOGLE_REGISTER);

        const { _id: userId } = user;

        if (!user.active) {
            user = await updateUser({ _id: userId }, { active: true });
            if (!user) throw Error;

            const deleteAllSessionsStatus = updateManySessions({ userId }, { valid: false });
            if (!deleteAllSessionsStatus) throw Error;

            const deleteEmailConfirmationStatus = await deleteEmailConfirmation({ userId });
            if (!deleteEmailConfirmationStatus) throw Error;
        }

        const tokens = await signNewSession({ ...user, userAgent: req.get("user-agent") || "" });
        if (!tokens) throw Error;

        res.cookie(COOKIE_TYPE.ACCESS_TOKEN, tokens.accessToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });
        res.cookie(COOKIE_TYPE.REFRESH_TOKEN, tokens.refreshToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });

        return res.send(SUCCESS_USER_FORMAT(user));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}
