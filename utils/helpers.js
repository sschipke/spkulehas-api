import { updateReservationTitlesWithNewName } from "../repoCalls/reservationRepoCalls";

export const canUserEdit = (user, reservation) => {
  if (user.status === "ADMIN") {
    return true;
  }
  return user.id === reservation.user_id;
};

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
  if (updatedReservations.length > 0) {
    responseBody.updatedReservations = updatedReservations;
    return response.status(200).json(responseBody).send();
  } else {
    return response.status(200).json(responseBody).send();
  }
};
