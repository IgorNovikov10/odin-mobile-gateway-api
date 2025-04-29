import { Router } from "express";
import { getAuthUrl, redirectVerify } from "../controllers/oidcController";

const router = Router();

router.get("/auth", getAuthUrl);
router.get("/verify", redirectVerify);

export default router;
