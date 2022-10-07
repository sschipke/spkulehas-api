import { database } from "../app";
import moment from "moment";

export const updateReservationTitlesWithNewName = async (
  userId,
  newName,
  oldName
) => {
  const now = moment().toISOString();
  console.log("Udpating reservations with new names.")
  return database("reservation")
    .returning(["id", "title"])
    .where({ user_id: userId })
    .andWhere({ title: oldName })
    .update({ title: newName, updated_at: now });
};
