import "@babel/polyfill";
const jwt = require("jsonwebtoken");
import { unauthorizedResponse } from "../utils/httpHelpers";

export const validateRequestToken = (req, res, next) => {
  const signature = process.env.TOKEN_SECRET;
  const nonsecurePaths = ["/login", "/forgot/password"];
  if (
    nonsecurePaths.includes(req.path) ||
    (req.baseUrl === "/api/v1/reservations" && req.method === "GET")
  ) {
    return next();
  }
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const bearer = authHeader.split(" ");
    const token = bearer[1];
    return jwt.verify(token, signature, (err, decoded) => {
      if (err) {
        const { message } = err;
        console.error("Error in jwt: ", message);
        if (message === "jwt expired") {
          return unauthorizedResponse(
            res,
            "This session has expired. Please login again."
          );
        } else {
          return unauthorizedResponse(res, message);
        }
      } else {
        console.log({ decoded });
        res.locals.user = decoded.user;
        res.locals.tokenType = decoded.type;
        res.locals.sessionId = decoded.sessionId;
        return next();
      }
    });
  } else {
    return unauthorizedResponse(res);
  }
};

export const generateWebtoken = (userProfile, expiration, type, sessionId) => {
  if (!expiration || !expiration.includes("hr")) {
    throw new Error("No expiration time inlcuded in generate request.");
  }
  if (!type) {
    type = "login";
  }
  const signature = process.env.TOKEN_SECRET;
  const { id, email, name, status } = userProfile;
  const data = {
    id,
    email,
    name,
    status
  };
  return jwt.sign({ user: data, type, sessionId }, signature, {
    expiresIn: expiration
  });
};

export const validateOrigin = (req, res, next) => {
  const { headers } = req;
  const { origin } = headers;
  console.log({ origin });
  if (!origin || !process.env.FRONT_END_BASE_URL.includes(origin)) {
    if (res.headersSent) {
      return next(err);
    }
    return unauthorizedResponse(res);
  }
  return next();
};
