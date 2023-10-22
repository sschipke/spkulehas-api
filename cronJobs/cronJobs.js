const cronJob = require("node-cron");
import { deleteInvalidSessions } from "../repoCalls/sessionRepoCalls";
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
