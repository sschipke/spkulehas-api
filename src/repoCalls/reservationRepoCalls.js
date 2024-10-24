import { database } from "../app";
import dayjs from "dayjs";
export const updateReservationTitlesWithNewName = async (
  userId,
  newName,
  oldName
) => {
  const now = dayjs().toISOString();
  console.log(
    "Udpating reservations with new name. Changing from: ",
    oldName,
    "to: ",
    newName
  );
  return database("reservation")
    .returning(["id", "title"])
    .where({ user_id: userId })
    .andWhere({ title: oldName })
    .update({ title: newName, updated_at: now });
};
