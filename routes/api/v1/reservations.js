require("@babel/polyfill");
import { database } from "../../../app";
import { logger } from "../../../utils/logging";
import { canUserEdit } from "../../../utils/helpers";
import { validateReservation } from "../../../validations/reservationvalidation";
import { validateRequestToken } from "../../../middleware/auth";
import { alertUsersOfDeletion } from "../../../email";
const moment = require("moment");
const express = require("express");
const router = express.Router();
router.use(validateRequestToken);

const RESERVATION_DELETION = "reservation_deleted";

router.get("/", async (req, res) => {
  try {
    const reservations = await getReservations();
    console.log(
      "Successfully sent GET for reservations. ",
      req.ips,
      new Date().toLocaleString({ timeZone: "American/Denver" })
    );
    return res.status(200).json({ reservations });
  } catch (err) {
    console.error(
      "Error sending GET Reservations Response: ",
      { err },
      "for",
      req.ip,
      " at ",
      new Date().toLocaleDateString()
    );
    return res.status(500).json({ msg: "Error sending reservations.", err });
  }
});

router.post("/", async (req, res, next) => {
  const { reservation } = req.body;
  const { user } = res.locals;
  if (!canUserEdit(user, reservation)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const error = validateReservation(reservation);
  if (Object.keys(error).length) {
    return res.status(422).json(error);
  }
  const conflictingReservations = await checkForConflictingReservations(
    reservation
  );
  if (conflictingReservations.length) {
    return res
      .status(422)
      .json({ error: "This reservation conflicts with another." });
  }
  try {
    const addedReservation = await addReservation(reservation);
    console.log({ addedReservation });
    logger("Successfully added reservation!", req);
    const response = addedReservation[0];
    return res.status(200).json({ reservation: response });
  } catch (error) {
    console.error("Unable to add reservation.", { reservation }, error);
    return res
      .status(500)
      .json({ error: `Unable to add reservation. ${error}` });
  }
});

router.put("/:reservation_id", async (req, res, next) => {
  const { reservation } = req.body;
  const { user } = res.locals;
  if (!canUserEdit(user, reservation)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  let reservationToUpdate = await findReservationById(reservation.id);
  if (!reservationToUpdate || !reservationToUpdate.length) {
    return res
      .status(404)
      .json({ error: "Unable to find reservation with id: " + reservation.id });
  }
  const error = validateReservation(reservation);
  if (Object.keys(error).length) {
    return res.status(422).json(error);
  }
  const conflictingReservations = await checkForConflictingReservations(
    reservation
  );
  console.log({ conflictingReservations });
  if (conflictingReservations.length > 1) {
    return res
      .status(422)
      .json({ error: "This reservation conflicts with another." });
  }
  let updatedReservation = await updateReservation(reservation);
  console.log({ updatedReservation });
  const response = updatedReservation[0];
  logger(`Successfully updated reservation.`, req);
  return res.status(200).json({ reservation: response });
});

router.delete("/:id", async (req, response) => {
  const id = Number(req.params.id);
  const { reservation } = req.body;
  const { user } = response.locals;
  if (!canUserEdit(user, reservation)) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  console.log({ deletedReservation: reservation });
  return database("reservation")
    .where({ id })
    .del()
    .then((res) => {
      if (res === 0) {
        return response
          .status(404)
          .json(`reservation with id: ${id} does not exist.`);
      }
      logger("Sucessfully deleted reservation: ", req);
      response.status(200).json("Reservation successfully removed.").send();
      handleDeletionEmail(reservation, user.id);
    });
});

async function getReservations() {
  return database("reservation")
    .column("id", "start", "end", "notes", "title", "user_id")
    .select()
    .orderBy("start", "asc")
    .catch((err) => {
      console.error("Error retrieving all reservations: ", err);
      return new Error("Error retrieving all reservations: ", { err });
    });
}

const updateReservation = async (reservation) => {
  reservation.updated_at = moment().toISOString();
  return database("reservation")
    .where({ id: reservation.id })
    .update(reservation, ["id", "user_id", "title", "start", "end", "notes"])
    .catch((err) => console.error("Error updating reservation. ", err));
};

const addReservation = async (reservation) => {
  return database("reservation").insert(reservation, [
    "id",
    "user_id",
    "title",
    "start",
    "end",
    "notes",
  ]);
};

const findReservationById = async (reservationId) => {
  return database("reservation").where({ id: reservationId }).select();
};

const getEmailsForDeletionEmail = async (userId) => {
  return database("user")
    .column("email")
    .innerJoin("email_setting", "email_setting.user_id", "user.id")
    .where({ setting_name: RESERVATION_DELETION })
    .andWhereNot("user_id", userId)
    .andWhere("value", true)
    .orderBy("email", "asc")
    .select("email")
    .then((emails) => {
      if (emails.length) {
        return emails.map((email) => email.email);
      }
      return emails;
    });
};

const getEmailsForSetting = async (setting) => {
  return database("user")
    .column("email")
    .innerJoin("email_setting", "email_setting.user_id", "user.id")
    .where({ setting_name: setting })
    .andWhere("value", true)
    .orderBy("email", "asc")
    .select("email")
    .then((emails) => {
      if (emails.length) {
        return emails.map((email) => email.email);
      }
      return emails;
    });
};

const handleDeletionEmail = (reservation, userId) => {
  try {
    getEmailsForDeletionEmail(userId)
      .then((members) => {
        console.log(members);
        if (members.length) {
          alertUsersOfDeletion(members, reservation);
        } else {
          console.log("Deletion email not sent: no eligible sbuscribers");
        }
      })
      .catch((error) =>
        console.error("Unable to send deletion alert. ", error)
      );
  } catch (error) {
    console.error("Unable to find members for deletion email. ", error);
  }
};

const checkForConflictingReservations = async (reservationToCheck) => {
  const { start, end } = reservationToCheck;
  return database("reservation")
    .where("start", ">=", start)
    .andWhere("end", "<=", end)
    .orWhere("end", ">=", start)
    .andWhere("start", "<=", end);
};

export default router;
