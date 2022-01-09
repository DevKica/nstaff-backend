import public_routes from "./public_routes";
import { Router, Request, Response } from "express";
import requireUser_routes from "./requireUser_routes";
import requireActiveUser_routes from "./requireActiveUser_routes";
import { SUCCESS } from "../../../helpers/errors/errorMessages";
import { requireUser, requireActiveUser } from "../../../middlewares/requireUser";

const router = Router();

router.post("/deepAuth", requireUser, (_: Request, res: Response) => res.send(SUCCESS));
router.post("/deepAuthActive", requireActiveUser, (_: Request, res: Response) => res.send(SUCCESS));

router.use(public_routes);
router.use(requireUser_routes);
router.use(requireActiveUser_routes);

export default router;
