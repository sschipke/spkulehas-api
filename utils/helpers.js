const { v4: uuidv4 } = require("uuid");
import dayjs from "dayjs";
const calendar = require('dayjs/plugin/calendar');
import { compareSync } from "bcrypt";
import { alertAdminOfMemberCreation, sendNewMemberEmail } from "../email";
import { updateReservationTitlesWithNewName } from "../repoCalls/reservationRepoCalls";
import { createResetSessionForUser } from "../repoCalls/sessionRepoCalls";
import { generateWebtoken } from "../middleware/auth";
import { findUserById } from "../repoCalls/userRepoCalls";
import { updateReservationsEtag } from "./contstants";

dayjs.extend(calendar);

export const canUserEdit = (user, reservation) => {
  return user.isAdmin || user.id === reservation.user_id;
};

export const safeTrim = (string) => {
  return (string || "").trim();
}

export const processNameChange = async (
  response,
  newUserProfile,
  oldProfile,
  responseBody
) => {
  const userId = newUserProfile.id;
  const newName = newUserProfile.name;
  const oldName = oldProfile.name;
  const updatedReservations = await updateReservationTitlesWithNewName(
    userId,
    newName,
    oldName
  );
  const newEtag = updateReservationsEtag();
  if (updatedReservations.length > 0) {
    responseBody.updatedReservations = updatedReservations;
    responseBody.reservationsEtag = newEtag;
    return response.status(200).json(responseBody).send();
  } else {
    return response.status(200).json(responseBody).send();
  }
};

export const createIdsForNewMember = (user) => {
  const userId = uuidv4();
  user.id = userId;
  user.user_id = userId;
  user.password = uuidv4();
}

export const handleNewUserCreationEmails = async (user, admin) => {
  const sessionId = await createResetSessionForUser(user.id, 6, "days");
  const expiration = dayjs().add(6, "days").calendar();
  const token = generateWebtoken(user, "6days", "email", sessionId[0].id);
  const baseUrl = process.env.FRONT_END_BASE_URL;
  const createUrl = new URL(`${baseUrl}?reset=${token}`).href;
  const loginUrl =  new URL(`${baseUrl}/login`).href;
  try {
    await sendNewMemberEmail(user, createUrl, loginUrl, expiration);
    alertAdminOfMemberCreation(user, admin);
  } catch (error) {
    console.error("Unable to send new member emails. ", error);
  }
}

export const confirmPassword = async (userId, password) => {
  if (!userId || !password) {
    return false;
  }
  const userToValidate = await findUserById(userId, password);
  const hash = userToValidate.password;
  return compareSync(password, hash);
}

export function generateEtag() {
  return (
    Math.random().toString(36).slice(8) +
    Math.random().toString(36).toUpperCase().slice(8)
  );
};
