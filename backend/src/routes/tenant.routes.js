import express from "express";
import { upgradeTenant } from "../controllers/tenant.controller.js";
import { adminOnly } from "../middlewares/admin.js";
import AuthToken from "../middlewares/auth.js"; 

const router = express.Router();

router.post("/:slug/upgrade", AuthToken, adminOnly, upgradeTenant);

export default router;
