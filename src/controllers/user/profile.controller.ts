import fs from "fs";
import path from "path";
import sharp from "sharp";
import { omit } from "lodash";
import { promisify } from "util";
import { unlink, existsSync } from "fs";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { getActiveUser, getAllActiveUsers, getUser, updateUser } from "../../services/user/user.service";
import { BAD_REQUEST, INVALID_FILE_FORMAT, NOT_FOUND, PHOTO_REQUIRED, SERVER_ERROR, SUCCESS, SUCCESS_DATA } from "../../helpers/errors/errorMessages";
import { defaultUserPhotoName, userPhotoSizes, usersPhotosDirName } from "../../constants/profile";
import generateRandomString from "../../utils/generateRandomString";
import mongoose from "mongoose";
import { SUCCESS_USER_FORMAT } from "../../helpers/errors/returnUserData";

export async function getUserToReturnHandler(_: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const user = await getUser({ _id: userId });
        if (!user) throw Error;

        return res.send(SUCCESS_USER_FORMAT(user));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function getPrivateUserInfoHandler(_: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const userObject = await getUser({ _id: userId });

        if (!userObject) throw Error;

        return res.send(SUCCESS_DATA(omit(userObject, "isAdmin")));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function getPublicUserInfoHandler(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) return res.send(BAD_REQUEST);

        const user = await getActiveUser({ _id: userId });

        if (!user) return res.send(NOT_FOUND);

        return res.send(SUCCESS_DATA(omit(user, "isAdmin", "updatedAt", "active")));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function getUserPhotoHandler(req: Request, res: Response) {
    try {
        const { size, photoName } = req.params;

        const userObject = await getUser({ profilePhotoPath: photoName });
        if (!userObject) return res.sendFile(path.join(usersPhotosDirName, `${size}.${defaultUserPhotoName}`));

        const userPath = path.join(usersPhotosDirName, `${size}.${userObject.profilePhotoPath}`);
        if (!existsSync(userPath)) return res.sendFile(path.join(usersPhotosDirName, `${size}.${defaultUserPhotoName}`));

        return res.sendFile(userPath);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function changeUserPhotoHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        if (!req.files) return res.send(PHOTO_REQUIRED);

        const profilePicture = req.files["profilePhoto"] as UploadedFile;
        const ext = profilePicture.name.split(".").slice(-1)[0];

        if (!["jpg", "jpeg", "png"].includes(ext)) return res.send(INVALID_FILE_FORMAT);

        const randomString = generateRandomString();

        const photoName = `${randomString}.jpg`;

        const oldUser = await getUser({ _id: userId });
        if (!oldUser) throw Error;

        const uploadImg = promisify(profilePicture.mv);

        const uploadPath = path.join(usersPhotosDirName, photoName);

        await uploadImg(uploadPath);

        const updatedUser = await updateUser({ _id: userId }, { profilePhotoPath: photoName });
        if (!updatedUser) throw Error;

        for (const size in userPhotoSizes) {
            await sharp(uploadPath)
                // @ts-ignore
                .resize(userPhotoSizes[size][0], userPhotoSizes[size][1])
                .toFile(path.join(usersPhotosDirName, `${size}.${photoName}`));
        }

        unlink(uploadPath, (err) => {
            if (err) throw Error;
        });

        if (oldUser.profilePhotoPath !== defaultUserPhotoName) {
            for (const size in userPhotoSizes) {
                const deletePath = path.join(usersPhotosDirName, `${size}.${oldUser.profilePhotoPath}`);
                if (fs.existsSync(deletePath)) {
                    unlink(deletePath, () => {});
                }
            }
        }

        return res.send(SUCCESS_USER_FORMAT(updatedUser));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function changeUserHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const updatedUser = await updateUser({ _id: userId }, req.body);
        if (!updatedUser) throw Error;

        return res.send(SUCCESS_USER_FORMAT(updatedUser));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function getAllActiveUsersHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;
        const allUsers = await getAllActiveUsers({ _id: userId });
        if (!allUsers) throw Error;

        return res.send(SUCCESS_DATA(allUsers));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}
