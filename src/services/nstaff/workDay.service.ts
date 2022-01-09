import workDayModel, { workDayInput, workDayFilter, workDayUpdate } from "../../models/nstaff/workDay.model";

export async function createWorkDay(input: workDayInput) {
    try {
        const workDay = await workDayModel.create(input);
        return workDay;
    } catch (e) {
        return null;
    }
}

export async function getSingleWorkDay(query: workDayFilter) {
    try {
        const workDay = await workDayModel.findOne(query).lean();
        return workDay;
    } catch (e) {
        return null;
    }
}

export async function getAllWorkDays(query: workDayFilter) {
    try {
        const workDays = await workDayModel.find(query).sort({ day: -1 });
        return workDays;
    } catch (e) {
        return null;
    }
}

export async function updateWorkDay(query: workDayFilter, update: workDayUpdate) {
    try {
        const newWorkDay = await workDayModel.findOneAndUpdate(query, update, { new: true }).lean();
        return newWorkDay;
    } catch (e) {
        return null;
    }
}

export async function deleteSingleWorkDay(query: workDayFilter) {
    try {
        const deleteStatus = await workDayModel.deleteOne(query);
        return deleteStatus;
    } catch (e) {
        return null;
    }
}
