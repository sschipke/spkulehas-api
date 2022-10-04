const cronJob = require("node-cron");
import { deleteInvalidSessions } from "../repoCalls/sessionRepoCalls";
import {
  sendSessionDeletionEmail,
  sendSessionDeletionErrorEmail
} from "../email";

export const deleteOldSessions = cronJob.schedule("15 2 12 * *", async () => {
  console.log("Running task!", new Date().toTimeString());
  try {
    const count = await deleteInvalidSessions();
    sendSessionDeletionEmail(count);
  } catch (error) {
    sendSessionDeletionErrorEmail(error);
  }
});
