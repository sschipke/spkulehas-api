import express from "express";
import cors from "cors";
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
export const database = require("knex")(configuration);
import { logRequest } from "./utils/logging";
import { errorHandler } from "./middleware/errors";
import reservations from "./routes/api/v1/reservations"
import user from "./routes/api/v1/user";
if (environment === "development") {
  console.log("loaded")
  require("dotenv").config();
}

if (environment !== "production") {
  console.log("Using environment: ", {environment});
}
const app = express();
app.locals.title = "SpKuLeHaS API";
app.use(cors());
app.use(express.json());
app.use(logRequest);

app.use("/api/v1/user", user);
app.use("/api/v1/reservations", reservations);

app.get("/api/v1/teapot", (request, response) => {
  return response
  .status(418)
  .json("The server refuses the attempt to brew coffee with a teapot");
})

app.use((err, req, res, next) => {
  if (err) {
    return errorHandler();
  }
  return next();
});


export default app;
