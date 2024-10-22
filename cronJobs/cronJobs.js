const cronJob = require("node-cron");
import { deleteInvalidSessions } from "../repoCalls/sessionRepoCalls";
  import { deletePastReservations } from "../repoCalls/reservationRepoCalls";
import {
  sendSessionDeletionEmail,
  sendSessionDeletionErrorEmail
} from "../email";

export const deleteOldSessions = cronJob.schedule("15 2 12 * *", async () => {
  console.info("Deleting Expired Sessions.", new Date().toTimeString());
  try {
    const count = await deleteInvalidSessions();
    if (count) {
      sendSessionDeletionEmail(count);
    }
  } catch (error) {
    sendSessionDeletionErrorEmail(error);
  }
});

// Every year on May 12th, delete the reservations from two years ago.
export const deletePastReservationsJob = cronJob.schedule("0 0 12 5 *", async () => {
  console.info("Deleting Past Reservations.", new Date().toTimeString());
  try {
    ///TODO: Send email that reservations have been deleted.
    const count = await deletePastReservations();
    console.info("Reservations to delete: ", count.length);
    console.info({count});
    // if (count) {
    //   sendSessionDeletionEmail(count);
    // }
  } catch (error) {
    console.error(error);
  }
});
