import { ContentfulStatusCode } from "hono/utils/http-status";
import { ErrorCodeType } from './constants';

export class AppError extends Error {
  public code: ErrorCodeType;
  public status: ContentfulStatusCode;

  constructor(code: ErrorCodeType, message: string, status: ContentfulStatusCode = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}
