import { Router } from "express";
import { getAllActiveUsersHandler, getPublicUserInfoHandler } from "../../../controllers/user/profile.controller";
import { requireActiveUser } from "../../../middlewares/requireUser";

const router = Router();

router.get("/publicInfo/:userId", requireActiveUser, getPublicUserInfoHandler);
router.get("/allUsers", requireActiveUser, getAllActiveUsersHandler);

export default router;
