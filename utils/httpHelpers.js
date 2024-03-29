export const unauthorizedResponse = (response, message) => {
  const errorMessage = message ? message : "Unathorized";
  return response.status(401).json({ error: errorMessage });
};

export const forbiddenResponse = (response, message) => {
  const errorMessage = message ? message : "Forbidden";
  return response.status(403).json({ error: errorMessage });
};

export const notFoundResponse = (response, message) => {
  const errorMessage = message ? message : "Not found.";
  return response.status(404).json({ error: errorMessage });
};

export const unknownErrorResponse = (response, message) => {
  const errorMessage = message ? message : "Something went wrong.";
  return response.status(500).json({ error: errorMessage });
};

export const conflictResponse = (response, message) => {
  const errorMessage = message ? message : "Something went wrong.";
  return response.status(409).json({ error: errorMessage });
};

export const preconditionFailedResponse = (response, message) => {
  console.warn("Req failed: Etag mismatch.");
  const errorMessage = message ? message : "Refresh reservations data.";
  return response.status(412).json({ error: errorMessage });
};
