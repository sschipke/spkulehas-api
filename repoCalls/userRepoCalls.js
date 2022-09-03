import { database } from "../app";
import moment from "moment";
const { v4: uuidv4 } = require("uuid");

const RESET_TYPE = "password_reset";

export const createResetSessionForUser = async (userId) => {
  const id = uuidv4();
  const now = moment().add(2, "hours");
  const session = {
    id,
    user_id: userId,
    type: RESET_TYPE,
    expires: now.toISOString(),
  };
  return database("session").insert(session, ["id"]);
};

const invalidateSession = async (sessionId, now) => {
  return database("session")
    .where({ id: sessionId })
    .update({ valid: false, updated_at: now });
};

export const validateSession = async (sessionId) => {
  const validationInfo = { isValid: true, message: "" };
  return database("session")
    .where({ id: sessionId })
    .then((sessions) => {
      if (sessions.length !== 1) {
        validationInfo.isValid = false;
        validationInfo.message = "Please request another reset email.";
        return validationInfo;
      }
      const session = sessions[0];
      const now = moment();
      if (now.isSameOrAfter(session.expires) || !session.valid) {
        validationInfo.isValid = false;
        validationInfo.message =
          "This link is expired. Please request another reset email.";
        return validationInfo;
      }
      return invalidateSession(sessionId, now.toISOString())
        .then(() => validationInfo)
        .catch((err) => {
          console.error("Error updating reset session. ", err);
          validationInfo.isValid = false;
          validationInfo.message =
            "Unable to updated password. Please try again in a few moments.";
          return validationInfo;
        });
    });
};
