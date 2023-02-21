import { database } from "../app";
import dayjs from "dayjs";
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const { v4: uuidv4 } = require("uuid");
dayjs.extend(isSameOrAfter);

export const RESET_TYPE = "password_reset";
const allowedUnits = ["hours", "days"];

export const createResetSessionForUser = async (userId, number, unit) => {
  const id = uuidv4();
  const now = dayjs();
  let expiration;
  if (number && unit && allowedUnits.includes(unit)) {
    expiration = now.add(number, unit);
  } else {
    expiration = now.add(2, "hours");
  }
  const session = {
    id,
    user_id: userId,
    type: RESET_TYPE,
    expires: expiration.toISOString()
  };
  console.log("Creating session: ", {session});
  return database("session").insert(session, ["id"]);
};

const invalidateSession = async (sessionId, now) => {
  return database("session")
    .where({ id: sessionId })
    .update({ valid: false, expires: now, updated_at: now });
};

export const invalidateOtherSessions = async (userId, type) => {
  const now = dayjs().toISOString();
  return database("session")
    .where({ user_id: userId, type, valid: true })
    .update({ valid: false, updated_at: now, expires: now });
};

export const checkSession = async (sessionId, type, userId) => {
  const validationInfo = {
    isValid: true,
    message: "This link is not valid. Please Request another."
  };
  const now = dayjs();
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
      const now = dayjs();
      return invalidateSession(sessionId, now.toISOString())
        .then(() => validationInfo)
        .catch((err) => {
          console.error("Error updating reset session. ", err);
          validationInfo.isValid = false;
          validationInfo.message =
            "Unable to updated session. Please try again in a few dayjss.";
          return validationInfo;
        });
    } else {
      return validationInfo;
    }
  });
};

export const deleteInvalidSessions = async () => {
  const now = dayjs().toISOString();
  return database("session")
    .where({ valid: false })
    .orWhere("expires", "<=", now)
    .del();
};
