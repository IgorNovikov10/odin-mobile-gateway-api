import { Router } from "express";
import {
  getAuthUrl,
  redirectVerify,
  refreshTokenHandler,
} from "../controllers/oidcController";

const router = Router();

router.get("/auth", getAuthUrl);
router.get("/verify", redirectVerify);
router.post("/token/refresh", refreshTokenHandler);

export default router;
