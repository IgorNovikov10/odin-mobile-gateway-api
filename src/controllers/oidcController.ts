import { Response, NextFunction } from "express";
import { OidcAuthRequest, OidcVerifyRequest } from "../shared/types";
import { ApiError } from "../shared/classes";
import { generateAuthUrl } from "../services/oidcService";
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

// Handle redirect from Signicat
export const redirectVerify = async (
  req: OidcVerifyRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state } = req.query;

    console.log("code", code);
    console.log("state", state);

    if (!code) {
      throw new ApiError(400, "Missing code in query");
    }

    const payload = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: config.signicat.redirectUri,
      code,
      client_id: config.signicat.clientId,
    });

    const tokenUrl = `${config.signicat.baseUrl}/token`;
    const basicAuth = Buffer.from(
      `${config.signicat.clientId}:${config.signicat.clientSecret}`
    ).toString("base64");

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: payload.toString(),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      const errorDescription =
        responseBody.error_description || "Failed to create token";
      throw new ApiError(response.status, errorDescription);
    }

    res.send(`
      <html>
        <body>
          <script>
            const appPayload = ${JSON.stringify({
              idToken: responseBody.id_token,
              accessToken: responseBody.access_token,
              tokenType: responseBody.token_type,
              refreshToken: responseBody.refresh_token,
              scope: responseBody.scope,
              expiresIn: responseBody.expires_in?.toString(),
            })};
    
            window.ReactNativeWebView?.postMessage(JSON.stringify(appPayload));
          </script>
          Redirecting...
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
};
