export class ExternalContractError extends Error {
  override name = 'ExternalContractError';
  constructor(resource: string) { super(`Unexpected response from ${resource}`); }
}

export class AppRequestError extends Error {
  override name = 'AppRequestError';
  constructor(message: string, readonly status = 0) { super(message); }
}
