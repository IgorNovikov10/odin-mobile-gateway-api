import { Response } from "express";
import { config } from "../shared/config";

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
          window.ReactNativeWebView?.postMessage(appPayload);
        </script>
      </body>
    </html>
  `);
};
