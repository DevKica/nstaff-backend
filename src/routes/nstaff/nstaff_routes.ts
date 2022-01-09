import { Router } from "express";
import monthlyRates_routes from "./monthlyRates_routes";
import workDays_routes from "./workDays_routes";

const router = Router();

router.use("/monthlyRates", monthlyRates_routes);
router.use("/workDays", workDays_routes);

export default router;
