export const timeZone = { timeZone: "American/Denver" };

export const timeString = new Date().toLocaleString(timeZone);

export const logger = (message, req) => {
    const { ip, headers } = req;
    const { origin } = headers;
  console.log(
    `${message} at IP:`,
    ip,
    "URL: ",
    req.originalUrl,
    " from: ",
    origin,
    " at ",
    timeString
  );
};

export const logRequest = (req, res, next) => {
  const { method, originalUrl, ip, headers } = req;
  const { origin } = headers;
  console.log(
    "Incoming request:",
    "url:",
    originalUrl,
    "method:",
    method,
    "ip:",
    ip,
    " from: ",
    origin,
    "at:",
    timeString
  );
  return next();
};
