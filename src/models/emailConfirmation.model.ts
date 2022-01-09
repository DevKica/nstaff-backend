import mongoose, { ObjectId } from "mongoose";
import { userDocument } from "./user.model";
export interface emailConfirmationFilter {
    _id?: ObjectId | string;
    userId?: userDocument["_id"];
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface emailConfirmationCreateInput {
    userId: userDocument["_id"];
    email: string;
}
export interface emailConfirmationDocument extends emailConfirmationCreateInput {
    _id: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const emailConfirmationModelSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, unique: true, ref: "user" },
        email: { type: String, unique: true },
        __v: { type: Number, select: false },
    },
    {
        timestamps: true,
    }
);

const EmailConfirmationModel = mongoose.model<emailConfirmationDocument>("emailConfirmation", emailConfirmationModelSchema);

export default EmailConfirmationModel;
