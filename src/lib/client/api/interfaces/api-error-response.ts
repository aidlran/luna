export interface IApiMaybeErrorResponse {
  // TODO: improve/standardise
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}
