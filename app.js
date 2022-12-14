import express from "express";
import cors from "cors";
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
export const database = require("knex")(configuration);
import { validateOrigin } from "./middleware/auth";
import { logRequest } from "./utils/logging";
import { errorHandler } from "./middleware/errors";
import { deleteOldSessions } from "./cronJobs/cronJobs";
import reservations from "./routes/api/v1/reservations";
import user from "./routes/api/v1/user";
import sessionsRouter from "./routes/api/v1/session";
import adminRouter from "./routes/api/v1/admin";
if (environment === "development") {
  console.log("loaded");
  require("dotenv").config();
}

if (environment !== "production") {
  console.log("Using environment: ", { environment });
}
const app = express();
app.locals.title = "SpKuLeHaS API";
app.use(cors());
app.use(express.json());
app.use(logRequest);
app.disable("x-powered-by");

app.use((err, req, res, next) => {
  if (err) {
    return errorHandler();
  }
  return next();
});

app.use(validateOrigin);

app.use("/api/v1/user", user);
app.use("/api/v1/reservations", reservations);
app.use("/api/v1/session", sessionsRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/api/v1/teapot", (request, response) => {
  return response
    .status(418)
    .json("The server refuses the attempt to brew coffee with a teapot");
});

deleteOldSessions.start();

export default app;
