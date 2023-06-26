/** @deprecated moved to `web-lib`. */
export interface IApiMaybeErrorResponse {
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}
