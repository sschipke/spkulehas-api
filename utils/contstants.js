import { generateEtag } from "./helpers";

export let reservationsEtag = generateEtag();

export function updateReservationsEtag() {
  reservationsEtag = generateEtag();
  console.log("Updated reservations eTag: ", reservationsEtag);
  return reservationsEtag;
}