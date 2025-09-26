import { Response, NextFunction } from "express";
import {
  OidcAuthRequest,
  OidcVerifyRequest,
  OidcTokenRequest,
  OidcIdTokenDecryptRequest,
} from "../shared/types";
import {
  generateAuthUrl,
  sendWebViewMessage,
  requestToken,
} from "../services/oidcService";
import { config } from "../shared/config";
import path from "path";
import { readFileSync } from "fs";
import {
  importJWK,
  jwtDecrypt,
  jwtVerify,
  decodeJwt,
  compactDecrypt,
} from "jose";

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

    console.log("refreshToken from the app: ", refreshToken);

    if (!refreshToken) {
      res.status(400).json({ error: "Missing refresh token" });
      return;
    }

    const payload = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: config.signicat.clientId,
      scope: config.signicat.scope,
    });

    const { success, data } = await requestToken(payload);

    console.log("OIDC response: ", data);

    if (!success) {
      res.status(400).json(data);
      return;
    }

    res.json({
      accessToken: data.access_token,
      idToken: data.id_token,
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
    console.log("redirect query:", req.query);

    const { code, state, error, error_description } = req.query;

    if (error) {
      return sendWebViewMessage(res, {
        error,
        errorDescription:
          error_description || "OIDC provider returned an error",
      });
    }

    if (!code) {
      return sendWebViewMessage(res, { error: "Missing authorization code" });
    }

    const payload = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: config.signicat.redirectUri,
      code: code as string,
      client_id: config.signicat.clientId,
    });

    const { success, data } = await requestToken(payload);

    if (!success) {
      return sendWebViewMessage(res, {
        error: data.error_description || "Failed to create token",
      });
    }

    return sendWebViewMessage(res, {
      accessToken: data.access_token,
      idToken: data.id_token,
      tokenType: data.token_type,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in?.toString(),
    });
  } catch (err: any) {
    return sendWebViewMessage(res, {
      error: err?.message || "Unexpected error",
    });
  }
};

// Handle ID token decryption
export const decryptIdTokenHandler = async (
  req: OidcIdTokenDecryptRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: "Missing idToken" });
      return;
    }

    // This file should be available to be able to decode token with the Signicat private key
    const jwkPath = path.resolve(process.cwd(), "SignicatOdinKey.json");
    const jwkRaw = readFileSync(jwkPath, "utf-8");
    const jwk = JSON.parse(jwkRaw);
    const key = await importJWK(jwk, jwk.alg || "RSA-OAEP");

    const { plaintext, protectedHeader } = await compactDecrypt(idToken, key);

    const nestedJwt = new TextDecoder().decode(plaintext);
    const payload = decodeJwt(nestedJwt);

    res.json({
      payload,
      header: protectedHeader,
      nestedJwt,
    });
  } catch (error: any) {
    next(error);
  }
};
