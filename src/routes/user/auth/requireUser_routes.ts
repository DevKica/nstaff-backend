import { Router } from "express";
import { requireUser } from "../../../middlewares/requireUser";
import { basicSchemaValidation } from "../../../middlewares/basicValidation";
import { changePasswordSchema, passwordCheckSchema } from "../../../schemas/user.schema";
import { changeEmailHandler, resendEmailConfirmation } from "../../../controllers/user/email.controller";
import { deleteAccountHandler, deleteAllUserSessionsHandler, deleteSingleUserSessionHandler } from "../../../controllers/user/auth.controller";
import { loginSchema } from "../../../schemas/session.schema";
import { getUserToReturnHandler } from "../../../controllers/user/profile.controller";
import { changePasswordHandler } from "../../../controllers/user/password.controller";

const router = Router();

router.get("/getUserData", requireUser, getUserToReturnHandler);

router.patch("/deleteAllSessions", requireUser, deleteAllUserSessionsHandler);
router.patch("/deleteSingleSession", requireUser, deleteSingleUserSessionHandler);

router.patch("/changePassword", [basicSchemaValidation(changePasswordSchema), requireUser], changePasswordHandler);
router.patch("/changeEmail", [requireUser, basicSchemaValidation(loginSchema)], changeEmailHandler);
router.post("/resendEmailConfirmation", requireUser, resendEmailConfirmation);

router.post("/deleteAccount", [requireUser, basicSchemaValidation(passwordCheckSchema)], deleteAccountHandler);

export default router;
