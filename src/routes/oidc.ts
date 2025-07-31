import { Router } from "express";
import {
  getAuthUrl,
  redirectVerify,
  refreshTokenHandler,
  decryptIdTokenHandler,
} from "../controllers/oidcController";

const router = Router();

router.get("/auth", getAuthUrl);
router.get("/verify", redirectVerify);
router.post("/token/refresh", refreshTokenHandler);
router.post("/token/id/decrypt", decryptIdTokenHandler);

export default router;
