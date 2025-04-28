export const config = {
  signicat: {
    baseUrl: "https://odinfondene.sandbox.signicat.com/auth/open/connect",
    clientId: "preprod.odinfondene.mobileid",
    redirectUri: "http://localhost:3000/api/v1/oidc/verify",
    scope: "openid profile mobileid signicat.national_id",
    responseType: "code",
    prompt: "login",
    acrValue: "urn:signicat:oidc:method:nbid",
    locale: "no",
  },
};
