import express from "express";
import cors from "cors";
import { default as dbConfig } from "./knexfile.js";
import knex from "knex";
import { validateOrigin } from "./middleware/auth.js";
import { logRequest } from "./utils/logging.js";
import { errorHandler } from "./middleware/errors.js";
import {
  deleteOldSessions,
  deletePastReservationsJob
} from "./cronJobs/cronJobs.js";
import reservations from "./routes/api/v1/reservations.js";
import user from "./routes/api/v1/user.js";
import sessionsRouter from "./routes/api/v1/session.js";
import adminRouter from "./routes/api/v1/admin.js";
import { ENVIRONMENT } from "./utils/contstants.js";

export const database = knex(dbConfig[ENVIRONMENT]);

if (ENVIRONMENT === "development") {
  import("dotenv").then((dotenv) => {
    dotenv.config();
    console.log("loaded");
  });
}

if (ENVIRONMENT !== "production") {
  console.log("Using environment: ", { ENVIRONMENT });
}
const app = express();
app.locals.title = "SpKuLeHaS API";
app.use(cors());
app.use(express.json());
app.use(logRequest);
app.disable("x-powered-by");

app.use((err, req, res, next) => {
  if (err) {
    console.error("Error in error handler: ", err);
    return errorHandler();
  }
  return next();
});

app.get("/api/v1/teapot", (request, response) => {
  return response
    .status(418)
    .json("The server refuses the attempt to brew coffee with a teapot.");
});

app.get("/api/v1/monitor", (request, response) => {
  return response.status(204).send();
});

app.use(validateOrigin);

app.use("/api/v1/user", user);
app.use("/api/v1/reservations", reservations);
app.use("/api/v1/session", sessionsRouter);
app.use("/api/v1/admin", adminRouter);

deleteOldSessions.start();
deletePastReservationsJob.start();

export default app;
