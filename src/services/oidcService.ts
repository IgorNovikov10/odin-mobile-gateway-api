import { Response } from "express";
import { config } from "../shared/config";
import { OidcTokenResponse } from "../shared/types";

export const generateAuthUrl = (): string => {
  const {
    baseUrl,
    clientId,
    redirectUri,
    scope,
    responseType,
    prompt,
    acrValue,
    locale,
  } = config.signicat;

  const queryParams = new URLSearchParams({
    response_type: responseType,
    scope,
    client_id: clientId,
    redirect_uri: redirectUri,
    prompt,
    acr_values: acrValue,
    ui_locales: locale,
    state: `INAPP_CHANNEL${acrValue}`,
  });

  return `${baseUrl}/authorize?${queryParams.toString()}`;
};

export const sendWebViewMessage = (res: Response, payload: object) => {
  res.send(`
    <html>
      <body>
        <script>
          const appPayload = ${JSON.stringify(payload)};
          window.ReactNativeWebView?.postMessage(JSON.stringify(appPayload));
        </script>
      </body>
    </html>
  `);
};

export const requestToken = async (
  payload: URLSearchParams
): Promise<{ success: boolean; data: OidcTokenResponse }> => {
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

  const data: OidcTokenResponse = await response.json();

  return {
    success: response.ok,
    data,
  };
};
