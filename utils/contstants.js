import { generateEtag } from "./helpers";

export let reservationsEtag = generateEtag();

console.log("Initial etag: ", reservationsEtag)

export function updateReservationsEtag() {
  reservationsEtag = generateEtag();
  console.log("Updated reservations eTag: ", reservationsEtag);
  return reservationsEtag;
}