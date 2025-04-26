import { Response, NextFunction } from "express";
import { OidcAuthRequest, OidcVerifyRequest } from "../shared/types";
import { ApiError } from "../shared/classes";
import { generateAuthUrl } from "../services/oidcService";

// Get authorization URL
export const getAuthUrl = (
  _: OidcAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authUrl = generateAuthUrl();

    res.json({ authUrl });
  } catch (error) {
    next(error);
  }
};

// Handle redirect from Signicat
export const redirectVerify = (
  req: OidcVerifyRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { code, state } = req.query;

    console.log("code", code);
    console.log("state", state);

    if (!code) {
      throw new ApiError(400, "Missing code in query");
    }

    res.json({
      message: "Received code, exchange for token next.",
      code,
      state,
    });
  } catch (error) {
    next(error);
  }
};
