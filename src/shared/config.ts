export const config = {
  // TODO: remove the hardcode, use some secret manager/env variables instead
  signicat: {
    baseUrl: "https://odinonline.sandbox.signicat.com/auth/open/connect",
    clientId: "sandbox-jolly-cheese-721",
    clientSecret: "ee5XhnpU3Obi85fWa3LINjy7m3picZqIuldjSv2dfSiTbu3f",
    redirectUri:
      "https://odin-mobile-gateway-api.onrender.com/api/v1/oidc/verify",
    scope: "openid mobileid nin profile nbid-extra",
    responseType: "code",
    prompt: "login",
    acrValue: "idp:nbid",
    locale: "no",
  },
};
