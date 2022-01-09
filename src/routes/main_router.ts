import { Router } from "express";
import user_routes from "./user/user_routes";
import nstaff_routes from "./nstaff/nstaff_routes";

const router = Router();

router.use("/user", user_routes);
router.use("/nstaff", nstaff_routes);

export default router;
