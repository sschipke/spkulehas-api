export const timeZone = { timeZone: "American/Denver" };

export const timeString = new Date().toLocaleString(timeZone);

export const logger = (message, req) => {
  console.log(
    `${message} at IP:`,
    req.ips,
    "URL: ",
    req.originalUrl,
    // "for: ",
    // req["body"]["user"]["id"],
    " at ",
    timeString
  );
};

export const logRequest = (req, res, next) => {
  const { method, originalUrl, ip } = req;
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
