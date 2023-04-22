export interface IApiMaybeErrorResponse {
  // TODO: improve
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}
