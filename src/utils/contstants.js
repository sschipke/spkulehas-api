import { generateEtag } from "./helpers.js";

export let reservationsEtag = generateEtag();

console.log("Initial etag: ", reservationsEtag);

export function updateReservationsEtag() {
  reservationsEtag = generateEtag();
  console.log("Updated reservations eTag: ", reservationsEtag);
  return reservationsEtag;
}

const determineEnvironment = () => {
  let defaultEnv = process.env.NODE_ENV || "development";

  if (defaultEnv === "local") {
    defaultEnv = "development";
  }
  return defaultEnv;
};

export const ENVIRONMENT = determineEnvironment();
