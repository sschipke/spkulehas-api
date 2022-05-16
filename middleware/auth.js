import "@babel/polyfill";
const jwt = require("jsonwebtoken");

export const validateRequestToken = (req, res, next) => {
  const signature = process.env.TOKEN_SECRET;
  const nonsecurePaths = ["/login"];
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
        return next();
      }
    });
  }
};

export const generateWebtoken = (userProfile) => {
  const signature = process.env.TOKEN_SECRET;
  const { id, email, name, status } = userProfile;
  const data = {
    id,
    email,
    name,
    status,
  };
  return jwt.sign({ user: data }, signature, { expiresIn: "1hr" });
};