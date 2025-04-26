export const config = {
  signicat: {
    baseUrl: "https://preprod.signicat.com/oidc",
    clientId: "preprod.odinfondene.mobileid",
    redirectUri: "http://localhost:3000/api/v1/oidc/verify",
    scope: "openid profile mobileid signicat.national_id",
    responseType: "code",
    prompt: "login",
    acrValue: "urn:signicat:oidc:method:nbid",
    locale: "no",
  },
};
