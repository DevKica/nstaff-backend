import mongoose, { ObjectId } from "mongoose";
import { userDocument } from "../user.model";

export interface monthlyRateUpdate {
    rate?: number;
}

export interface monthlyRateFilter extends monthlyRateUpdate {
    _id?: ObjectId | string;
    userId?: userDocument["_id"];
    month?: string;
}

export interface montlyRateInput {
    userId: userDocument["_id"];
    rate: number;
    month: string;
}

export interface montlyRateDocument extends montlyRateInput {
    _id: ObjectId | string;
}

const montlyRateModelSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rate: { type: Number, required: true, min: 0 },
    month: { type: String, required: true },
    __v: { type: Number, select: false },
});

const MontlyRateModel = mongoose.model<montlyRateDocument>("monthlyRates", montlyRateModelSchema);

export default MontlyRateModel;
