require("@babel/polyfill");
import { database } from "../../../app";
import { logger } from "../../../utils/logging";
import {
  canUserEdit,
  validateReservation
} from "../../../utils/helpers";
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
    console.log("Successfully sent GET for reservations. ", req.ips, new Date().toLocaleString({ timeZone: "American/Denver" }));
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
  if (error.length) {
    return res.status(422).json(error);
  }
  try {
    const addedReservation = await addReservation(reservation);
    console.log({ addedReservation });
    logger("Successfully added reservation!", req)
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
  if (error["error"]) {
    return res.status(422).json(error);
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
  console.log({deletedReservation: reservation})
  return database("reservation")
    .where({ id })
    .del()
    .then((res) => {
      if (res === 0) {
        return response
          .status(404)
          .json(`reservation with an id: ${id} does not exist.`);
      }
      logger("Sucessfully deleted reservation: ", req);
      response.status(200).json("Reservation successfully removed.").send();
      handleDeletionEmail(reservation);
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
        return emails.map(email => email.email);
      }
      return emails;
    })
};

const handleDeletionEmail = (reservation) => {
  //TODO: Remove User who deleted reservation from email list
  try {
    getEmailsForSetting(RESERVATION_DELETION)
      .then((members) => {
        if (members.length) {
          alertUsersOfDeletion(members, reservation);
        }
      })
      .catch((error) =>
        console.error("Unable to send deletion alert. ", error)
      );
  } catch (error) {
    console.error("Unable to find members for deletion email. ", error);
  }
}

export default router;
