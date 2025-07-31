import { Request } from "express";

export interface OidcAuthRequest extends Request {}

export interface OidcVerifyRequest extends Request {
  query: {
    code: string;
    state: string;
  };
}

export interface OidcTokenRequest extends Request {
  query: {
    refreshToken: string;
  };
}

export interface OidcIdTokenDecryptRequest extends Request {
  query: {
    idToken: string;
  };
}

export interface OidcTokenResponse {
  id_token?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}
