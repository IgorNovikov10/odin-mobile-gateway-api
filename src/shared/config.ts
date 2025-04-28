export const config = {
  signicat: {
    baseUrl: "https://odinfondene.sandbox.signicat.com/auth/open/connect",
    clientId: "sandbox-precious-goat-757",
    redirectUri:
      "https://odin-mobile-gateway-api.onrender.com/api/v1/oidc/verify",
    scope: "openid mobileid nin profile",
    responseType: "code",
    prompt: "login",
    acrValue: "idp:nbid",
    locale: "no",
  },
};
