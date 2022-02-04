import { Request, Response } from "express";
import { SERVER_ERROR, NOT_FOUND, SUCCESS_DATA, WORK_DAY_EXISTS, SUCCESS, BAD_REQUEST, UPDATE_DAY_EXISTS } from "../../helpers/errors/errorMessages";
import { getSingleMonthlyRate } from "../../services/nstaff/monthlyRate.service";
import { getSingleWorkDay, createWorkDay, getAllWorkDays, updateWorkDay, deleteSingleWorkDay } from "../../services/nstaff/workDay.service";
import { MONTHLY_RATE__DOES_NOT_EXISTS } from "../../helpers/errors/errorMessages";

export async function createWorkDayHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const checkIfMontlyRateExists = await getSingleMonthlyRate({ userId, month: req.body.date.slice(0, 7) });

        if (!checkIfMontlyRateExists) return res.send(MONTHLY_RATE__DOES_NOT_EXISTS);

        const checkIfExists = await getSingleWorkDay({ userId, month: req.body.date.slice(0, 7), day: req.body.date.slice(-2) });
        if (checkIfExists) return res.send(WORK_DAY_EXISTS);

        const newWorkDay = await createWorkDay({ userId, ...req.body, month: req.body.date.slice(0, 7), day: req.body.date.slice(-2) });
        if (!newWorkDay) throw Error;

        return res.send(SUCCESS);
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function getSingleWorkDayHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;
        const { workDayId } = req.params;

        const workDay = await getSingleWorkDay({ userId, _id: workDayId });
        if (!workDay) return res.send(NOT_FOUND);

        return res.send(SUCCESS_DATA(workDay));
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function getAllWorkDaysHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;
        const { month } = req.params;

        const workDays = await getAllWorkDays({ userId, month });
        if (!workDays) return BAD_REQUEST;

        return res.send(SUCCESS_DATA(workDays));
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function updateWorkDayHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;
        const { workDayId } = req.params;

        const checkIfMontlyRateExists = await getSingleMonthlyRate({ userId, month: req.body.date.slice(0, 7) });
        if (!checkIfMontlyRateExists) return res.send(MONTHLY_RATE__DOES_NOT_EXISTS);

        const checkIfExistsAtAll = await getSingleWorkDay({ _id: workDayId });
        if (!checkIfExistsAtAll) return res.send(BAD_REQUEST);

        if (checkIfExistsAtAll.month !== req.body.date.slice(0, 7) || checkIfExistsAtAll.day !== req.body.date.slice(-2)) {
            const checkIfExistsUpdate = await getSingleWorkDay({ userId, month: req.body.date.slice(0, 7), day: req.body.date.slice(-2) });
            if (checkIfExistsUpdate) return res.send(UPDATE_DAY_EXISTS);
        }

        const updatedWorkDay = await updateWorkDay({ userId, _id: workDayId }, { ...req.body, month: req.body.date.slice(0, 7), day: req.body.date.slice(-2) });
        if (!updatedWorkDay) return res.send(BAD_REQUEST);

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}

export async function deleteWorkDayHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;
        const { workDayId } = req.params;

        const deleteStatus = await deleteSingleWorkDay({ userId, _id: workDayId });
        if (!deleteStatus) throw Error;

        return res.send(SUCCESS);
    } catch (e) {
        return res.send(SERVER_ERROR);
    }
}
