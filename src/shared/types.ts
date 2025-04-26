import { Request } from "express";

export interface OidcAuthRequest extends Request {}

export interface OidcVerifyRequest extends Request {
  query: {
    code: string;
    state: string;
  };
}
