import argon2 from "argon2";
import { omit } from "lodash";
import UserModel, { userCreateInput, userFilter, userUpdate } from "../../models/user.model";

export async function createUser(input: userCreateInput) {
    try {
        const hash = await argon2.hash(input.password);
        input.password = hash;

        const user = await UserModel.create(input);

        return omit(user, "password");
    } catch (e) {
        return null;
    }
}

export async function getAllActiveUsers(query: userFilter) {
    try {
        const allUsers = await UserModel.find({ active: true, _id: { $ne: query._id } }, "name surname profilePhotoPath").lean();
        return allUsers;
    } catch (e) {
        return null;
    }
}

export async function getActiveUser(query: userFilter) {
    try {
        const activeUser = await UserModel.findOne({ active: true, ...query }).lean();
        if (!activeUser) throw Error;
        return omit(activeUser, "password");
    } catch (e) {
        return null;
    }
}

export async function getUser(query: userFilter) {
    try {
        const user = await UserModel.findOne(query).lean();

        if (!user) throw Error;

        return omit(user, "password");
    } catch (e) {
        return null;
    }
}

export async function validateUserPasswordByEmail(email: string, password: string) {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) throw Error;

        const isValid = await user.comparePassword(password);
        if (!isValid) throw Error;

        const userToReturn = await getUser({ email });
        if (!userToReturn) throw Error;

        return userToReturn;
    } catch (e) {
        return null;
    }
}

export async function validateUserPasswordById(_id: string, password: string) {
    try {
        const user = await UserModel.findOne({ _id });
        if (!user) throw Error;

        const isValid = await user.comparePassword(password);
        if (!isValid) throw Error;

        return true;
    } catch (e) {
        return null;
    }
}

export async function updateUser(query: userFilter, update: userUpdate) {
    try {
        if (update.password) {
            const hash = await argon2.hash(update.password);
            update.password = hash;
        }

        const user = await UserModel.findOneAndUpdate(query, update, { new: true }).lean();
        if (!user) throw Error;

        return user;
    } catch (e) {
        return null;
    }
}

export async function checkIfEmailExists(email: string) {
    const user = await getUser({ email: email.toLowerCase() });
    return user ? true : false;
}

export async function deleteUser(query: userFilter) {
    try {
        const deleteStatus = await UserModel.deleteOne(query);
        return deleteStatus;
    } catch (e) {
        return null;
    }
}
