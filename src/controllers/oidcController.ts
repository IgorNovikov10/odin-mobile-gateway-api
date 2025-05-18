import { Response, NextFunction } from "express";
import {
  OidcAuthRequest,
  OidcVerifyRequest,
  OidcTokenRequest,
} from "../shared/types";
import {
  generateAuthUrl,
  sendWebViewMessage,
  requestToken,
} from "../services/oidcService";
import { config } from "../shared/config";

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

// Handle refresh token functionality
export const refreshTokenHandler = async (
  req: OidcTokenRequest,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Missing refresh token" });
      return;
    }

    const payload = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: config.signicat.clientId,
    });

    const { success, data } = await requestToken(payload);

    if (!success) {
      res.status(400).json(data);
      return;
    }

    res.json({
      accessToken: data.access_token,
      tokenType: data.token_type,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in?.toString(),
    });
  } catch (error: any) {
    const errorMessage = error?.message || "Unexpected error";
    res.status(500).json({ error: errorMessage });
  }
};

// Handle redirect from Signicat
export const redirectVerify = async (
  req: OidcVerifyRequest,
  res: Response
): Promise<void> => {
  try {
    const { code, state } = req.query;

    // TODO: check if we need to check state parameter to send callbacks to the app
    console.log("code", code);
    console.log("state", state);

    if (!code) {
      return sendWebViewMessage(res, { error: "Missing authorization code" });
    }

    const payload = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: config.signicat.redirectUri,
      code,
      client_id: config.signicat.clientId,
    });

    const { success, data } = await requestToken(payload);

    if (!success) {
      const errorDescription =
        data.error_description || "Failed to create token";
      return sendWebViewMessage(res, { error: errorDescription });
    }

    sendWebViewMessage(res, {
      accessToken: data.access_token,
      tokenType: data.token_type,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in?.toString(),
    });
  } catch (error: any) {
    const errorMessage = error?.message || "Unexpected error";
    return sendWebViewMessage(res, { error: errorMessage });
  }
};
