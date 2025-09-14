import { Router } from "express";
import { inviteUser, login } from "../controllers/auth.controller.js";
import AuthToken from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/admin.js";

const router = Router();

router.post("/login", login);
router.post("/invite", AuthToken, adminOnly, inviteUser);

export default router;
