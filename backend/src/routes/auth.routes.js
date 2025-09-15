import { Router } from "express";
import { Check, inviteUser, login, logout } from "../controllers/auth.controller.js";
import AuthToken from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/admin.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", AuthToken, Check);
router.post("/invite", AuthToken, adminOnly, inviteUser);

export default router;
