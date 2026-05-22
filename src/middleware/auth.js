import jwt from "jsonwebtoken";
import config from "config";
import {
  unauthorizedResponse,
  forbiddenResponse
} from "../utils/httpHelpers.js";

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

export const allowOnlyAdmin = (req, res, next) => {
  if (!res.locals.user.isAdmin) {
    return forbiddenResponse(res);
  } else {
    next();
  }
};

export const generateWebtoken = (userProfile, expiration, type, sessionId) => {
  if (!expiration) {
    throw new Error("No expiration time inlcuded in generate request.");
  }
  if (!type) {
    type = "login";
  }
  const signature = process.env.TOKEN_SECRET;
  const { id, email, name, status, isAdmin } = userProfile;
  const data = {
    id,
    email,
    name,
    status,
    isAdmin
  };
  return jwt.sign({ user: data, type, sessionId }, signature, {
    expiresIn: expiration
  });
};

export const getAllowedOriginUrls = () => {
  try {
    const urls = config.get("allowedOriginUrls");
    if (Array.isArray(urls) && urls.length > 0) {
      return urls;
    }
  } catch {
    // allowedOriginUrls not defined for this environment
  }
  const frontEndUrl = config.get("frontEndOriginUrl") || "localhost";
  return [frontEndUrl];
};

export const isOriginAllowed = (origin) => {
  if (!origin) {
    return false;
  }
  return getAllowedOriginUrls().some((allowed) => origin.includes(allowed));
};

export const validateOrigin = (req, res, next) => {
  const { origin } = req.headers;
  console.log({ origin });
  if (!isOriginAllowed(origin)) {
    if (res.headersSent) {
      return next();
    }
    return unauthorizedResponse(res);
  }
  return next();
};
