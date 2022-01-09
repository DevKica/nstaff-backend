import config from "config";
import { Request, Response } from "express";
import COOKIE_TYPE from "../../helpers/cookies/type";
import sendEmailHandler from "../../utils/emailConfig";
import { deleteResetPassword } from "../../services/user/resetPassword.service";
import { createEmailConfirmation, deleteEmailConfirmation } from "../../services/user/emailConfirmation.service";
import { deleteManySessions, signNewSession, updateManySessions, updateSingleSession } from "../../services/user/session.service";
import { INPUT_EMAIL_EXIST, INVALID_LOGIN_CREDENTIALS_ERROR, INVALID_PASSWORD, SERVER_ERROR, SUCCESS, SUCCESS_DATA } from "../../helpers/errors/errorMessages";
import { checkIfEmailExists, createUser, deleteUser, getUser, validateUserPasswordByEmail, validateUserPasswordById } from "../../services/user/user.service";
import { SUCCESS_USER_FORMAT } from "../../helpers/errors/returnUserData";
import { unlink } from "fs-extra";
import path from "path";
import { defaultUserPhotoName, userPhotoSizes, usersPhotosDirName } from "../../constants/profile";

const MAX_AGE_TOKEN_COOKIE = config.get<number>("MAX_AGE_TOKEN_COOKIE");

export async function createUserHandler(req: Request, res: Response) {
    try {
        const emailExists = await checkIfEmailExists(req.body.email);

        if (emailExists) return res.send(INPUT_EMAIL_EXIST);

        const user = await createUser(req.body);

        if (!user) throw Error;

        const emailConfirmation = await createEmailConfirmation({ userId: user._id, email: user.email });

        if (!emailConfirmation) throw Error;

        sendEmailHandler({ userConfirmationId: user._id, objectId: String(emailConfirmation._id) }, user.email, "confirmEmail");

        const tokens = await signNewSession({ ...user, userAgent: req.get("user-agent") || "" });

        if (!tokens) throw Error;

        res.cookie(COOKIE_TYPE.ACCESS_TOKEN, tokens.accessToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });
        res.cookie(COOKIE_TYPE.REFRESH_TOKEN, tokens.refreshToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });

        return res.send(SUCCESS_USER_FORMAT(user));
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function loginHandler(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await validateUserPasswordByEmail(email, password);

        if (!user) return res.send(INVALID_LOGIN_CREDENTIALS_ERROR);

        const tokens = await signNewSession({ ...user, userAgent: req.get("user-agent") || "" });

        if (!tokens) throw Error;

        res.cookie(COOKIE_TYPE.ACCESS_TOKEN, tokens.accessToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });
        res.cookie(COOKIE_TYPE.REFRESH_TOKEN, tokens.refreshToken, { sameSite: "strict", httpOnly: true, maxAge: MAX_AGE_TOKEN_COOKIE });

        return res.send(SUCCESS_USER_FORMAT(user));
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function deleteSingleUserSessionHandler(_: Request, res: Response) {
    try {
        const { sessionId } = res.locals.user;

        const updateStatus = await updateSingleSession({ _id: sessionId }, { valid: false });
        if (!updateStatus) throw Error;

        res.clearCookie(COOKIE_TYPE.ACCESS_TOKEN);
        res.clearCookie(COOKIE_TYPE.REFRESH_TOKEN);

        return res.send(SUCCESS);
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function deleteAllUserSessionsHandler(_: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const updateStatus = await updateManySessions({ userId }, { valid: false });
        if (!updateStatus) throw Error;

        res.clearCookie(COOKIE_TYPE.ACCESS_TOKEN);
        res.clearCookie(COOKIE_TYPE.REFRESH_TOKEN);

        return res.send(SUCCESS);
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function deleteAccountHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const { password } = req.body;

        const validPassword = await validateUserPasswordById(userId, password);

        if (!validPassword) return res.send(INVALID_PASSWORD);

        const user = await getUser({ _id: userId });

        if (!user) throw Error;

        if (user.profilePhotoPath !== defaultUserPhotoName) {
            for (const size in userPhotoSizes) {
                const deletePath = path.join(usersPhotosDirName, `${size}.${user.profilePhotoPath}`);
                unlink(deletePath, (err) => {
                    if (err) throw Error;
                });
            }
        }

        const deleteSessionsStatus = deleteManySessions({ userId });

        if (!deleteSessionsStatus) throw Error;

        const deleteEmailConfirmationStatus = await deleteEmailConfirmation({ userId });

        if (!deleteEmailConfirmationStatus) throw Error;

        const deleteResetPasswordStatus = await deleteResetPassword({ userId });

        if (!deleteResetPasswordStatus) throw Error;

        const deleteUserStatus = await deleteUser({ _id: userId });

        if (!deleteUserStatus) throw Error;

        res.clearCookie(COOKIE_TYPE.ACCESS_TOKEN);
        res.clearCookie(COOKIE_TYPE.REFRESH_TOKEN);

        return res.send(SUCCESS);
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}
