require("@babel/polyfill");
import { database } from "../../../app";
import { logger } from "../../../utils/logging";
import {
  canUserEdit,
  notifyUsersOfReservationUpdateByAdmin
} from "../../../utils/helpers";
import { validateReservation } from "../../../validations/reservationvalidation";
import { validateRequestToken } from "../../../middleware/auth";
import {
  alertUsersOfDeletion,
  notifyAdminOfReservationCreation
} from "../../../email";
import {
  forbiddenResponse,
  notFoundResponse,
  unauthorizedResponse,
  unknownErrorResponse,
  conflictResponse,
  preconditionFailedResponse
} from "../../../utils/httpHelpers";
import { isAdmin } from "../../../validations/userValidation";
import {
  reservationsEtag,
  updateReservationsEtag
} from "../../../utils/contstants";
const dayjs = require("dayjs");
const express = require("express");
const router = express.Router();

router.use(validateRequestToken);

const RESERVATION_DELETION = "reservation_deleted";

router.get("/", async (req, res) => {
  try {
    const reservations = await getReservations();
    console.log(
      "Successfully sent GET for reservations. ",
      { reservationsEtag },
      req.ip,
      new Date().toLocaleString({ timeZone: "American/Denver" })
    );
    return res.status(200).json({ reservations, reservationsEtag });
  } catch (err) {
    console.error(
      "Error sending GET Reservations Response: ",
      { err },
      "for",
      req.ip,
      " at ",
      new Date().toLocaleDateString()
    );
    return res.status(500).json({ error: "Error sending reservations." });
  }
});

router.post("/new", async (req, res) => {
  const { reservation } = req.body;
  const { user } = res.locals;
  if (!canUserEdit(user, reservation)) {
    console.error(
      "Unable to create reservation: User did not have permission."
    );
    return forbiddenResponse(res);
  }

  if (!validateEtagHeader(req)) {
    return preconditionFailedResponse(res);
  }

  const validationErrors = validateReservation(reservation, isAdmin(user));
  if (Object.keys(validationErrors).length) {
    console.error("Unable to create reservation: ", validationErrors);
    const { error } = validationErrors;
    return conflictResponse(res, error);
  }
  const conflictingReservations =
    await checkForConflictingReservations(reservation);
  if (conflictingReservations.length) {
    console.error("Unable to create reservation: Conflicting Reservation.");
    return conflictResponse(res, "This reservation conflicts with another.");
  }
  try {
    const addedReservation = await addReservation(reservation);
    console.info({ addedReservation });
    logger("Successfully added reservation!", req);
    const createdReservation = addedReservation[0];
    res
      .status(200)
      .json({
        reservation: createdReservation,
        reservationsEtag: updateReservationsEtag()
      })
      .send();
    if (user.email !== process.env.ADMIN_EMAIL) {
      try {
        await notifyAdminOfReservationCreation(user, createdReservation);
      } catch (error) {
        console.error(
          "Unable to notify admin of reservation creation. ",
          error
        );
      }
    }
  } catch (error) {
    console.error("Unable to add reservation.", { reservation }, error);
    return res
      .status(500)
      .json({ error: `Unable to add reservation. ${error}` });
  }
});

router.get("/new", async (req, res) => {
  return unauthorizedResponse(
    res,
    "This session has expired. Please login again."
  );
});

router.put("/:reservation_id", async (req, res) => {
  try {
    const reservationId = Number(req.params.reservation_id);
    const { reservation } = req.body;
    const { user } = res.locals;

    if (!validateEtagHeader(req)) {
      return preconditionFailedResponse(res);
    }

    const reservationToUpdate = await findReservationById(reservationId);

    if (!canUserEdit(user, reservationToUpdate)) {
      console.warn(
        "Unable to update reservation: user did not have permission."
      );
      return forbiddenResponse(res);
    }

    if (!reservationToUpdate) {
      return notFoundResponse(
        res,
        "Unable to find reservation with id: " + reservationId
      );
    }
    const isUserAdmin = isAdmin(user);
    const validationErrors = validateReservation(reservation, isUserAdmin);
    if (Object.keys(validationErrors).length) {
      const { error } = validationErrors;
      return conflictResponse(res, error);
    }
    const conflictingReservations =
      await checkForConflictingReservations(reservation);
    console.log({ conflictingReservations });
    if (
      conflictingReservations.length > 1 ||
      (conflictingReservations.length &&
        Number(conflictingReservations[0].id) !== reservationId)
    ) {
      return conflictResponse(res, "This reservation conflicts with another.");
    }
    const updatedReservation = await updateReservation(reservation);
    console.log({ updatedReservation });
    const responseReservation = updatedReservation[0];
    logger(`Successfully updated reservation.`, req);
    updateReservationsEtag();
    res
      .status(200)
      .json({ reservation: responseReservation, reservationsEtag })
      .send();
    if (
      reservationToUpdate.user_id !== responseReservation.user_id &&
      isUserAdmin
    ) {
      console.info("Processing reservation switch by admin.");
      await notifyUsersOfReservationUpdateByAdmin(
        reservationToUpdate,
        responseReservation,
        user
      );
    }
    return;
  } catch (error) {
    console.error("Unable to update reservation. Err: ", error);
    return unknownErrorResponse(res, "Unable to update reservation.");
  }
});

router.delete("/:id", async (req, response) => {
  const id = Number(req.params.id);
  const { reservation, shouldSendDeletionEmail } = req.body;
  const { user } = response.locals;
  const currentReservation = await findReservationById(id);
  console.log({ currentReservation });
  if (!currentReservation) {
    return notFoundResponse(
      response,
      `Could not find reservation with id: ${id}`
    );
  }
  if (!canUserEdit(user, currentReservation)) {
    console.log("Unable to delete reservation: user did not have permission.");
    return forbiddenResponse(response);
  }
  console.log({ deletedReservation: reservation });
  return database("reservation")
    .where({ id })
    .del()
    .then((res) => {
      if (res === 0) {
        return notFoundResponse(
          response,
          `Reservation with id: ${id} does not exist.`
        );
      }
      logger("Sucessfully deleted reservation: ", req);
      updateReservationsEtag();
      response.status(200).json({ reservationsEtag }).send();
      if (shouldSendDeletionEmail) {
        handleDeletionEmail(currentReservation, user.id);
      } else {
        console.log("Not sending deletion email due to admin's request.");
      }
    });
});

router.get("/validate/:etag", async (req, res) => {
  const { etag } = req.params;
  console.log(
    "Comparing reservation etags: ",
    "etag in req: ",
    etag,
    "beEtag: ",
    reservationsEtag
  );
  if (etag === reservationsEtag) {
    return res.status(204).send();
  } else {
    return res.status(412).send();
  }
});

async function getReservations() {
  return database("reservation")
    .column("id", "start", "end", "notes", "title", "user_id")
    .select()
    .orderBy("start", "asc")
    .catch((err) => {
      console.error("Error retrieving all reservations: ", err);
      throw new Error("Error retrieving all reservations: ", { err });
    });
}

const updateReservation = async (reservation) => {
  reservation.updated_at = dayjs().toISOString();
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
    "notes"
  ]);
};

const findReservationById = async (reservationId) => {
  return database("reservation").where({ id: reservationId }).select().first();
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

const handleDeletionEmail = (reservation, userId) => {
  const now = dayjs();

  if (now.isSameOrAfter(reservation.end, "day")) {
    console.info("Past reservation. Not sending notification.");
    return;
  }
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

const validateEtagHeader = (req) => {
  const eTag = req.headers["if-match"];
  console.info("reqEtag: ", eTag, "reservationsEtag: ", reservationsEtag);
  return eTag && eTag === reservationsEtag;
};

export default router;
