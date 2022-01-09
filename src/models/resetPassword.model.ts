import mongoose, { ObjectId } from "mongoose";
import { userDocument } from "./user.model";

export interface resetPasswordFilter {
    _id?: ObjectId | string;
    userId?: userDocument["_id"];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface resetPasswordCreateInput {
    userId: userDocument["_id"];
}

export interface resetPasswordDocument extends resetPasswordCreateInput {
    createdAt: Date;
    updatedAt: Date;
}

const resetPasswordModelSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, unique: true, ref: "user" },
        __v: { type: Number, select: false },
    },
    {
        timestamps: true,
    }
);

const ResetPasswordIdModel = mongoose.model<resetPasswordDocument>("resetPasswordId", resetPasswordModelSchema);

export default ResetPasswordIdModel;
