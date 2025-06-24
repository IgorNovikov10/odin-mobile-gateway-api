import { Router } from "express";
import {
  getAuthUrl,
  redirectVerify,
  refreshTokenHandler,
  getUserInfo,
} from "../controllers/oidcController";

const router = Router();

router.get("/auth", getAuthUrl);
router.get("/getUserInfo", getUserInfo);
router.get("/verify", redirectVerify);
router.post("/token/refresh", refreshTokenHandler);

export default router;
