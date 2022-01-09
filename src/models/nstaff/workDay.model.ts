import mongoose, { ObjectId } from "mongoose";
import { userDocument } from "../user.model";
export interface workDayUpdate {
    userId?: userDocument["_id"];
    month?: string;
    day?: string;
    startOfWork?: string;
    endOfWork?: string;
    tipCash?: number;
    tipCard?: number;
    receipts?: number;
}

export interface workDayFilter extends workDayUpdate {
    _id?: ObjectId | string;
    userId?: userDocument["_id"];
}

export interface workDayInput {
    userId: userDocument["_id"];
    month: string;
    day: string;
    startOfWork: string;
    endOfWork: string;
    tipCash: number;
    tipCard: number;
    receipts: number;
}

export interface workDayDocument extends workDayInput {
    _id?: ObjectId | string;
}

const workDayModelSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
    month: { type: String, required: true },
    day: { type: String, required: true },
    startOfWork: { type: String, required: true },
    endOfWork: { type: String, required: true },
    tipCash: { type: Number, required: true, min: 0 },
    tipCard: { type: Number, required: true, min: 0 },
    receipts: { type: Number, required: true, min: 0 },
    __v: { type: Number, select: false },
});

const WorkDayModel = mongoose.model<workDayDocument>("workDay", workDayModelSchema);

export default WorkDayModel;
