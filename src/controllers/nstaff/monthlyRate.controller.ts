import { Request, Response } from "express";
import { BAD_REQUEST, MONTHLY_RATE_EXISTS, SERVER_ERROR, SUCCESS, SUCCESS_DATA } from "../../helpers/errors/errorMessages";
import { getSingleMonthlyRate, createMontlyRate, updateMonthlyRate, getAllMonthlyRates } from "../../services/nstaff/monthlyRate.service";

export async function createMonthlyRateHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const checkIfExists = await getSingleMonthlyRate({ userId, month: req.body.month });
        if (checkIfExists) return res.send(MONTHLY_RATE_EXISTS);

        const monthlyRate = await createMontlyRate({ ...req.body, userId });
        if (!monthlyRate) throw Error;

        return res.send(SUCCESS);
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function updateMonthlyRateHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;
        const { monthlyRateId } = req.params;

        const newMonthlyRate = await updateMonthlyRate({ userId, _id: monthlyRateId }, { rate: req.body.rate });
        if (!newMonthlyRate) return res.send(BAD_REQUEST);

        return res.send(SUCCESS);
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function getAllMonthlyRatesHandler(_: Request, res: Response) {
    try {
        const userId = res.locals.user._id;

        const monthlyRates = await getAllMonthlyRates({ userId });
        if (!monthlyRates) throw Error;

        return res.send(SUCCESS_DATA(monthlyRates));
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}

export async function getSingleMonthlyRateHandler(req: Request, res: Response) {
    try {
        const { month } = req.params;
        const userId = res.locals.user._id;

        const monthlyRate = await getSingleMonthlyRate({ userId, month });
        if (!monthlyRate) throw Error;

        return res.send(SUCCESS_DATA(monthlyRate));
    } catch (e: unknown) {
        return res.send(SERVER_ERROR);
    }
}
