import { Router } from "express";
import auth_routes from "./auth/auth_routes";
import profile_routes from "./profile/profile_routes";

const router = Router();

router.use("/auth", auth_routes);
router.use("/profile", profile_routes);

export default router;
