const moment = require("moment");

export const validateReservation = (reservation) => {
  //Note: This method will mutate/update the reservation's notes & title with trimmed values
  //TODO: Delete or add color
  delete reservation.color;
  const { start, end, title, notes } = reservation;
  const requiredParemeters = ["start", "end", "title", "user_id"];
  for (let requiredParameter of requiredParemeters) {
    if (!reservation[requiredParameter]) {
      return { error: `Missing a required parameter of: ${requiredParameter}` };
    }
  }
  const trimmedTitle = title.trim();
  if (!trimmedTitle || trimmedTitle.length > 20) {
    return { error: "The title is invalid." };
  }
  reservation.title = trimmedTitle;
  const trimmedNotes = notes.trim();
  if (trimmedNotes.length > 60) {
    return { error: "Submitted Notes are invalid." };
  }
  reservation.notes = trimmedNotes ? trimmedNotes : "";
  console.log("IsValid start", moment(start).isValid())
  if (!moment(start).isValid()) {
    console.log("Returning error")
    return { error: "Invalid start date" };
  }
  if (!moment(end).isValid()) {
    console.log("Error for end");
    return { error: "Invalid end date" };
  }
  if (moment(reservation.start).isSameOrAfter(reservation.end)) {
    console.log("comparing")
    return { error: "Start date cannot be after end date." };
  }
  return {};
};
