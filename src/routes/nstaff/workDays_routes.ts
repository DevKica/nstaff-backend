import { Router } from "express";
import { createWorkDayHandler, deleteWorkDayHandler, getAllWorkDaysHandler, getSingleWorkDayHandler, updateWorkDayHandler } from "../../controllers/nstaff/workDay.controller";
import { basicSchemaValidation } from "../../middlewares/basicValidation";
import { requireActiveUser } from "../../middlewares/requireUser";
import { workDaySchema } from "../../schemas/nstaff/workDaySchema";

const router = Router();

router.get("/getAll/:month", requireActiveUser, getAllWorkDaysHandler);
router.get("/getOne/:workDayId", requireActiveUser, getSingleWorkDayHandler);
router.post("/create", [requireActiveUser, basicSchemaValidation(workDaySchema)], createWorkDayHandler);
router.patch("/update/:workDayId", [requireActiveUser, basicSchemaValidation(workDaySchema)], updateWorkDayHandler);
router.delete("/delete/:workDayId", requireActiveUser, deleteWorkDayHandler);

export default router;
