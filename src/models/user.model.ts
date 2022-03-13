import argon2 from "argon2";
import mongoose, { ObjectId } from "mongoose";
import { defaultUserPhotoName } from "./../constants/profile";

export interface userUpdate {
    email?: string;
    name?: string;
    surname?: string;
    password?: string;
    active?: boolean;
    isAdmin?: boolean;
    profilePhotoPath?: string;
}

export interface userFilter extends userUpdate {
    _id?: ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface userProperties {
    email: string;
    name: string;
    surname: string;
    password: string;
}

export interface userCreateInput extends userProperties {
    repeatPassword: string;
    active?: boolean;
}

export interface userDocument extends userProperties {
    profilePhotoPath: string;
    active: boolean;
    isAdmin: boolean;
    _id: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(passwordToVerify: string): Promise<Boolean>;
}

const userModelSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        password: { type: String, required: true },
        active: { type: Boolean, required: true, default: true },
        isAdmin: { type: Boolean, required: true, default: false },
        profilePhotoPath: { type: String, required: true, default: defaultUserPhotoName },
        __v: { type: Number, select: false },
    },
    {
        timestamps: true,
    }
);

userModelSchema.methods.comparePassword = async function (passwordToVerify: string): Promise<Boolean> {
    try {
        const user = this as userDocument;
        const valid = await argon2.verify(user.password, passwordToVerify);
        return valid;
    } catch (e: unknown) {
        return false;
    }
};

const UserModel = mongoose.model<userDocument>("user", userModelSchema);

export default UserModel;
