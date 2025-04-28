export const config = {
  signicat: {
    baseUrl: "https://odinfondene.sandbox.signicat.com/auth/open/connect",
    clientId: "dev.odinfondene.mobileid",
    redirectUri:
      "https://odin-mobile-gateway-api.onrender.com/api/v1/oidc/verify",
    scope: "openid profile mobileid signicat.national_id",
    responseType: "code",
    prompt: "login",
    acrValue: "urn:signicat:oidc:method:nbid",
    locale: "no",
  },
};
