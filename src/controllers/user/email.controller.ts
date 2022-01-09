import config from "config";
import { Request, Response } from "express";
import { verifyJWT } from "../../utils/jwtConfig";
import sendEmailHandler from "../../utils/emailConfig";
import { updateManySessions } from "../../services/user/session.service";
import { deleteResetPassword } from "../../services/user/resetPassword.service";
import { checkIfEmailExists, getUser, updateUser, validateUserPasswordById } from "../../services/user/user.service";
import { createEmailConfirmation, deleteEmailConfirmation, findEmailConfirmation } from "../../services/user/emailConfirmation.service";
import { UNACTIVE_LINK, EMAIL_NOT_FOUND, EXPIRED_LINK, FORBIDDEN, INPUT_EMAIL_EXIST, INVALID_PASSWORD, SERVER_ERROR, SUCCESS } from "../../helpers/errors/errorMessages";
import COOKIE_TYPE from "../../helpers/cookies/type";
import { SUCCESS_DATA } from "./../../helpers/errors/errorMessages";
import { SUCCESS_USER_FORMAT } from "../../helpers/errors/returnUserData";

export async function confirmEmailHandler(req: Request, res: Response) {
    try {
        const EMAIL_SECRET_TOKEN = config.get<string>("EMAIL_SECRET_TOKEN");

        const { decoded, expired } = verifyJWT(req.params.token, EMAIL_SECRET_TOKEN);

        if (expired) return res.send(EXPIRED_LINK);

        if (!decoded) return res.send(FORBIDDEN);

        const { userConfirmationId, newEmail, objectId } = decoded;

        const emailConfirmation = await findEmailConfirmation({ userId: userConfirmationId, _id: objectId });

        if (!emailConfirmation) return res.send(UNACTIVE_LINK);

        const deleteEmailConfirmationStatus = await deleteEmailConfirmation({ userId: userConfirmationId });

        if (!deleteEmailConfirmationStatus) throw Error;

        if (newEmail) {
            const emailExists = await checkIfEmailExists(newEmail);
            if (emailExists) return res.send(INPUT_EMAIL_EXIST);

            const deleteResetPasswordEmailStatus = await deleteResetPassword({ userId: userConfirmationId });
            if (!deleteResetPasswordEmailStatus) throw Error;
        }

        const localUser = await getUser({ _id: userConfirmationId });

        if (!localUser) throw Error;

        const updateAllSessionsStatus = updateManySessions({ userId: localUser._id }, { valid: false });
        if (!updateAllSessionsStatus) throw Error;

        res.clearCookie(COOKIE_TYPE.ACCESS_TOKEN);
        res.clearCookie(COOKIE_TYPE.REFRESH_TOKEN);

        if (!localUser.active) {
            const activeUser = updateUser({ _id: localUser._id }, { active: true });
            if (!activeUser) throw Error;
            return res.send(SUCCESS);
        }

        const updatedUser = await updateUser({ _id: localUser._id }, { email: newEmail });
        if (!updatedUser) throw Error;

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function changeEmailHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const password = req.body.password;

        const validPassword = await validateUserPasswordById(userId, password);

        if (!validPassword) return res.send(INVALID_PASSWORD);

        const user = await getUser({ _id: userId });

        if (!user) throw Error;

        const newEmail = req.body.email;

        const emailExists = await checkIfEmailExists(newEmail);

        if (emailExists) return res.send(INPUT_EMAIL_EXIST);

        const deleteStatus = await deleteEmailConfirmation({ userId });

        if (!deleteStatus) throw Error;

        const emailConfirmation = await createEmailConfirmation({ userId, email: newEmail });

        if (!emailConfirmation) throw Error;

        if (user.active) {
            sendEmailHandler({ userConfirmationId: userId, newEmail, objectId: String(emailConfirmation._id) }, newEmail, "confirmEmail");
            return res.send(SUCCESS);
        } else {
            const updatedUser = await updateUser({ _id: userId }, { email: newEmail });
            if (!updatedUser) throw Error;
            sendEmailHandler({ userConfirmationId: userId, objectId: String(emailConfirmation._id) }, newEmail, "confirmEmail");
            return res.send(SUCCESS_USER_FORMAT(updatedUser));
        }
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function resendEmailConfirmation(_: Request, res: Response) {
    try {
        const { _id: userId, isActive } = res.locals.user;

        const emailConfirmation = await findEmailConfirmation({ userId });

        if (!emailConfirmation) return res.send(EMAIL_NOT_FOUND);

        if (isActive) {
            sendEmailHandler({ userConfirmationId: userId, newEmail: emailConfirmation.email, objectId: String(emailConfirmation._id) }, emailConfirmation.email, "confirmEmail");
        } else {
            sendEmailHandler({ userConfirmationId: userId, objectId: String(emailConfirmation._id) }, emailConfirmation.email, "confirmEmail");
        }

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}
