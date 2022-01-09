import config from "config";
import { Request, Response } from "express";
import { verifyJWT } from "../../utils/jwtConfig";
import sendEmailHandler from "../../utils/emailConfig";
import { updateManySessions } from "../../services/user/session.service";
import { getUser, updateUser, validateUserPasswordById } from "../../services/user/user.service";
import { createResetPassword, deleteResetPassword, findResetPassword } from "../../services/user/resetPassword.service";
import { INVALID_OLD_PASSWORD, SUCCESS, SERVER_ERROR, EMAIL_NOT_FOUND, EXPIRED_LINK, FORBIDDEN, UNACTIVE_LINK } from "../../helpers/errors/errorMessages";
import COOKIE_TYPE from "./../../helpers/cookies/type";

const EMAIL_SECRET_TOKEN = config.get<string>("EMAIL_SECRET_TOKEN");

export async function changePasswordHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const { oldPassword, password } = req.body;

        const validPassword = await validateUserPasswordById(userId, oldPassword);

        if (!validPassword) return res.send(INVALID_OLD_PASSWORD);

        const updatedUser = await updateUser({ _id: userId }, { password });

        if (!updatedUser) throw Error;

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function sendPasswordResetEmailHandler(req: Request, res: Response) {
    try {
        const { email } = req.body;

        const user = await getUser({ email });

        if (!user) return res.send(EMAIL_NOT_FOUND);

        const userId = user._id;

        const deleteStatus = await deleteResetPassword({ userId });

        if (!deleteStatus) throw Error;

        const resetPasswordObject = await createResetPassword({ userId });

        if (!resetPasswordObject) throw Error;

        sendEmailHandler({ userConfirmationId: String(userId), passwordReset: true, objectId: String(resetPasswordObject._id) }, email, "resetPassword");

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function verifyResetPasswordTokenHandler(req: Request, res: Response) {
    try {
        const { decoded, expired } = verifyJWT(req.params.token, EMAIL_SECRET_TOKEN);

        if (expired) return res.send(EXPIRED_LINK);

        if (!decoded || !decoded.passwordReset) return res.send(FORBIDDEN);

        const resetPasswordId = await findResetPassword({ userId: decoded.userConfirmationId, _id: decoded.objectId });

        if (!resetPasswordId) return res.send(UNACTIVE_LINK);

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function setNewPasswordHandler(req: Request, res: Response) {
    try {
        const { decoded, expired } = verifyJWT(req.params.token, EMAIL_SECRET_TOKEN);

        if (expired) return res.send(EXPIRED_LINK);

        if (!decoded || !decoded.passwordReset) return res.send(FORBIDDEN);

        const resetPasswordId = await findResetPassword({ userId: decoded.userConfirmationId, _id: decoded.objectId });

        if (!resetPasswordId) return res.send(UNACTIVE_LINK);

        const { password } = req.body;

        const updatedUser = await updateUser({ _id: decoded.userConfirmationId }, { password });

        if (!updatedUser) throw Error;

        if (!updatedUser.active) {
            const activeUser = await updateUser({ _id: decoded.userConfirmationId }, { active: true });
            if (!activeUser) throw Error;

            const deleteAllSessionStatus = updateManySessions({ userId: decoded.userCofirmationId }, { valid: false });
            if (!deleteAllSessionStatus) throw Error;
        }

        const deleteStatus = await deleteResetPassword({ userId: decoded.userConfirmationId });

        if (!deleteStatus) throw Error;

        const updateAllSessionsStatus = updateManySessions({ userId: decoded.userConfirmationId }, { valid: false });
        if (!updateAllSessionsStatus) throw Error;

        res.clearCookie(COOKIE_TYPE.ACCESS_TOKEN);
        res.clearCookie(COOKIE_TYPE.REFRESH_TOKEN);

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}
