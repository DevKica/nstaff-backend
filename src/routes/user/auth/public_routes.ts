import { Router } from "express";
import { loginSchema } from "../../../schemas/session.schema";
import { googleDeserialize } from "../../../middlewares/googleDeserialize";
import { basicSchemaValidation } from "../../../middlewares/basicValidation";
import { confirmEmailHandler } from "../../../controllers/user/email.controller";
import { createUserHandler, loginHandler } from "../../../controllers/user/auth.controller";
// import { googleLoginHandler, googleRegisterHandler } from "../../../controllers/user/google.controller";
import { checkEmailSchema, createUserSchema, setNewPasswordSchema, multiPasswordsCheckSchema } from "../../../schemas/user.schema";
import { sendPasswordResetEmailHandler, setNewPasswordHandler, verifyResetPasswordTokenHandler } from "../../../controllers/user/password.controller";

const router = Router();

router.post("/register", basicSchemaValidation(createUserSchema), createUserHandler);
router.post("/login", basicSchemaValidation(loginSchema), loginHandler);
router.post("/confirmEmail/:token", confirmEmailHandler);

// router.post("/googleLogin/:token", googleDeserialize, googleLoginHandler);
// router.post("/googleRegister/:token", [basicSchemaValidation(multiPasswordsCheckSchema), googleDeserialize], googleRegisterHandler);

router.post("/sendResetPasswordEmail", basicSchemaValidation(checkEmailSchema), sendPasswordResetEmailHandler);

router.post("/verifyResetPasswordToken/:token", verifyResetPasswordTokenHandler);
router.patch("/setNewPassword/:token", basicSchemaValidation(setNewPasswordSchema), setNewPasswordHandler);

export default router;
