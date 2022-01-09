import { Router } from "express";
import { changeUserPhotoHandler, changeUserHandler, getPrivateUserInfoHandler } from "../../../controllers/user/profile.controller";
import { basicSchemaValidation } from "../../../middlewares/basicValidation";
import { requireUser } from "../../../middlewares/requireUser";
import { generalUserSchema } from "../../../schemas/user.schema";

const router = Router();

router.get("/privateInfo", requireUser, getPrivateUserInfoHandler);
router.patch("/profilePhotoUpdate", requireUser, changeUserPhotoHandler);
router.patch("/generalUpdate", [requireUser, basicSchemaValidation(generalUserSchema)], changeUserHandler);

export default router;
