import { database } from "../app";
import moment from "moment";
const { v4: uuidv4 } = require("uuid");

export const RESET_TYPE = "password_reset";

export const createResetSessionForUser = async (userId) => {
  const id = uuidv4();
  const now = moment().add(2, "hours");
  const session = {
    id,
    user_id: userId,
    type: RESET_TYPE,
    expires: now.toISOString()
  };
  return database("session").insert(session, ["id"]);
};

const invalidateSession = async (sessionId, now) => {
  return database("session")
    .where({ id: sessionId })
    .update({ valid: false, expires: now, updated_at: now });
};

export const invalidateOtherSessions = async (userId, type) => {
  const now = moment().toISOString();
  return database("session")
    .where({ user_id: userId, type, valid: true })
    .update({ valid: false, updated_at: now, expires: now });
};

export const checkSession = async (sessionId, type, userId) => {
  const validationInfo = {
    isValid: true,
    message: "This link is not valid. Please Request another."
  };
  const now = moment();
  return database("session")
    .where({ id: sessionId })
    .then((sessions) => {
      if (sessions.length !== 1) {
        validationInfo.isValid = false;
        validationInfo.message = "Please request another reset email.";
        return validationInfo;
      }
      const session = sessions[0];
      if (now.isSameOrAfter(session.expires) || !session.valid) {
        validationInfo.isValid = false;
        validationInfo.message =
          "This link has expired. Please request another reset email.";
        return validationInfo;
      }
      if (session.type !== type) {
        validationInfo.isValid = false;
        return validationInfo;
      }
      if (session.user_id !== userId) {
        validationInfo.isValid = false;
        return validationInfo;
      }
      if (session.type !== type) {
        validationInfo.isValid = false;
        return validationInfo;
      }
      validationInfo.userId = session.user_id;
      return validationInfo;
    });
};

export const validateSession = async (sessionId, type, userId) => {
  return checkSession(sessionId, type, userId).then((validationInfo) => {
    if (validationInfo.isValid) {
      const now = moment();
      return invalidateSession(sessionId, now.toISOString())
        .then(() => validationInfo)
        .catch((err) => {
          console.error("Error updating reset session. ", err);
          validationInfo.isValid = false;
          validationInfo.message =
            "Unable to updated session. Please try again in a few moments.";
          return validationInfo;
        });
    } else {
      return validationInfo;
    }
  });
};

export const deleteInvalidSessions = async () => {
  const now = moment().toISOString();
  return database("session")
    .where({ valid: false })
    .orWhere("expires", "<=", now)
    .del();
};
