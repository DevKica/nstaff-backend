import { Router } from "express";
import { getSingleMonthlyRateHandler, getAllMonthlyRatesHandler, createMonthlyRateHandler, updateMonthlyRateHandler } from "../../controllers/nstaff/monthlyRate.controller";
import { basicSchemaValidation } from "../../middlewares/basicValidation";
import { requireActiveUser } from "../../middlewares/requireUser";
import { monthlyRateSchema, rateSchema } from "../../schemas/nstaff/monthlyRateSchema";

const router = Router();

router.get("/getOne/:month", requireActiveUser, getSingleMonthlyRateHandler);
router.get("/getAll", requireActiveUser, getAllMonthlyRatesHandler);
router.post("/create", [requireActiveUser, basicSchemaValidation(monthlyRateSchema)], createMonthlyRateHandler);
router.patch("/update/:monthlyRateId", [requireActiveUser, basicSchemaValidation(rateSchema)], updateMonthlyRateHandler);

export default router;
