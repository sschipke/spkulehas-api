export const timeZone = { timeZone: "American/Denver" };

export const timeString = new Date().toLocaleString(timeZone);

export const logger = (message, req) => {
  console.log(
    `${message} at IP:`,
    req.ips,
    "URL: ",
    req.originalUrl,
    " at ",
    timeString
  );
};

export const logRequest = (req, res, next) => {
  const { method, originalUrl, ip, headers } = req;
  console.log(
    "Incoming request:",
    "url:",
    originalUrl,
    "method:",
    method,
    "ip:",
    ip,
    "at:",
    timeString
  );
  return next();
};
