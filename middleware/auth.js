import "@babel/polyfill";
const jwt = require("jsonwebtoken");

export const validateRequestToken = (req, res, next) => {
  const signature = process.env.TOKEN_SECRET;
  const nonsecurePaths = ["/login", "/forgot/password"];
  const nononSecureMethod = "GET";
  if (nonsecurePaths.includes(req.path) || req.method === nononSecureMethod) {
    return next();
  }
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const bearer = authHeader.split(" ");
    const token = bearer[1];
    return jwt.verify(token, signature, (err, decoded) => {
      if (err) {
        console.error("Error in jwt: ", err.message);
        return res.status(401).json({ error: err.message });
      } else {
        console.log({ decoded });
        res.locals.user = decoded.user;
        res.locals.tokenType = decoded.type;
        res.locals.sessionId = decoded.sessionId;
        return next();
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized." });
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
    status,
  };
  return jwt.sign({ user: data, type, sessionId }, signature, {
    expiresIn: expiration,
  });
};

export const validateOrigin = (req, res, next) => {
  const { headers } = req;
  const { origin } = headers;
  console.log({origin})
  if (!origin || !process.env.FRONT_END_BASE_URL.includes(origin)) {
    if (res.headersSent) {
      return next(err);
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
};
