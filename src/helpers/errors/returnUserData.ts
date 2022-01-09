import { messageFormat } from "./messageFormat";
import { ObjectId } from "mongoose";
export interface userObjectClient {
    _id: string | ObjectId;
    email: string;
    name: string;
    surname: string;
    active: boolean;
    profilePhotoPath: string;
}

export const SUCCESS_USER_FORMAT = (data: userObjectClient) => {
    const { _id, email, name, surname, profilePhotoPath, active } = data;
    return { message: { _id, email, name, surname, profilePhotoPath, active }, status: 200 };
};
