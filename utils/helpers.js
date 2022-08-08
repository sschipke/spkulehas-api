const moment = require("moment");

export const canUserEdit = (user, reservation) => {
  if (user.status === "ADMIN") {
    return true;
  }
  return user.id === reservation.user_id;
};

export const validateReservation = (reservation) => {
  const { start, end, title } = reservation;
  const requiredParemeters = ["start", "end", "title", "user_id"];
  for (let requiredParameter of requiredParemeters) {
    if (!reservation[requiredParameter]) {
      return { error: `Missing a required parameter of: ${requiredParameter}` };
    }
  }
  const trimmedTitle = title.trim()
  console.log({trimmedTitle})
  if (!trimmedTitle) {
    console.log("Error")
    return { error: "A title is required." }
  }
  if (!moment(start).isValid()) {
    return { error: "Invalid start date" };
  }
  if (!moment(end).isValid()) {
    return { error: "Invalid end date" };
  }
  if (moment(reservation.start).isSameOrAfter(reservation.end)) {
    return { error: "Start date cannot be after end date." };
  }
  return {};
};
