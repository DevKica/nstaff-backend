import { Router } from "express";
import { getUserPhotoHandler } from "../../../controllers/user/profile.controller";

const router = Router();

router.get("/userProfilePhoto/:size/:photoName", getUserPhotoHandler);

export default router;
