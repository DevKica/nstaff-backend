import MontlyRateModel, { montlyRateInput, monthlyRateFilter, monthlyRateUpdate } from "../../models/nstaff/monthlyRate.model";
import { getAllWorkDays } from "./workDay.service";

export async function createMontlyRate(input: montlyRateInput) {
    try {
        const monthlyRate = await MontlyRateModel.create(input);
        return monthlyRate;
    } catch (e: unknown) {
        return null;
    }
}
export async function updateMonthlyRate(query: monthlyRateFilter, update: monthlyRateUpdate) {
    try {
        const newMonthlyRate = await MontlyRateModel.findOneAndUpdate(query, update, { new: true }).lean();
        return newMonthlyRate;
    } catch (e: unknown) {
        return null;
    }
}

export async function getAllMonthlyRates(query: monthlyRateFilter) {
    try {
        const monthlyRates = await MontlyRateModel.find(query).sort({ month: -1 }).lean();
        const withWorkdays = await Promise.all(
            monthlyRates.map(async (item) => {
                const workDays = await getAllWorkDays({ ...query, month: item.month });
                return { ...item, workDays };
            })
        );
        return withWorkdays;
    } catch (e: unknown) {
        return null;
    }
}
export async function getSingleMonthlyRate(query: monthlyRateFilter) {
    try {
        const monthlyRate = await MontlyRateModel.findOne(query);
        return monthlyRate;
    } catch (e: unknown) {
        return null;
    }
}
