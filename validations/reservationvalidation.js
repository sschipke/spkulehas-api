const moment = require("moment-timezone");

const WINTER_SEASON_START_2022 = "2022-10-24";
const WINTER_SEASON_END_2022 = "2023-05-21";
const WINTER_SEASON_START_2023 = "2023-10-23";
const WINTER_SEASON_END_2023 = "2024-05-20";
const WINTER_SEASON_START_2024 = "2024-10-21";
const WINTER_SEASON_END_2024 = "2025-05-18";
const MOUNTAIN_TZ = "America/Denver"

export const validateReservation = (reservation, isAdmin) => {
  const minDate = process.env.MINIMUM_RESERVATION_DATE;
  const maxReservationDate = process.env.MAXIMUM_RESERVATION_DATE;
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
  if (!trimmedTitle || trimmedTitle.length > 60) {
    return { error: "The title is invalid." };
  }
  reservation.title = trimmedTitle;
  const trimmedNotes = notes.trim();
  if (trimmedNotes.length > 60) {
    return { error: "Submitted Notes are invalid." };
  }
  reservation.notes = trimmedNotes ? trimmedNotes : "";

  if (!moment(start).isValid()) {
    return { error: "Invalid start date" };
  }
  if (!moment(end).isValid()) {
    return { error: "Invalid end date" };
  }
  if (moment(reservation.start).isAfter(reservation.end)) {
    return { error: "Start date cannot be after end date." };
  }
  if (moment(start).isBefore(minDate, "day")) {
    return { error: "This reservation is too early." };
  }
  if (moment(end).isAfter(maxReservationDate)) {
    return { error: "Reservation is too late." };
  }
  if (!isReservationLengthValid(start, end) && !isAdmin) {
    return { error: "Invalid reservation length." };
  }
  processReserVationDates(reservation);
  return {};
};

const isReservationLengthValid = (checkinDate, checkoutDate) => {
  const momentCheckin = moment(checkinDate);
  const momentCheckout = moment(checkoutDate);
  const maxLength = isInWinter(checkinDate) ? 14 : 7;
  const minLength = 1;
  const reservationLength = momentCheckout.diff(momentCheckin, "days");
  console.log({ reservationLength });
  if (reservationLength > maxLength || reservationLength < minLength) {
    return false;
  }
  return true;
};

export const isInWinter = (date) => {
  return (
    moment(date).isBetween(
      WINTER_SEASON_START_2022,
      WINTER_SEASON_END_2022,
      "day"
    ) ||
    moment(date).isBetween(
      WINTER_SEASON_START_2023,
      WINTER_SEASON_END_2023,
      "day"
    ) ||
    moment(date).isBetween(
      WINTER_SEASON_START_2024,
      WINTER_SEASON_END_2024,
      "day"
    )
  );
};

const processReserVationDates = (reservation) => {
  //Default reservation times to noon
  const noonObject = {
    hour: 12,
    minute: 0,
    second: 0,
    millisecond: 0
  };
  const { start, end } = reservation;
    reservation.start = moment(start).tz(MOUNTAIN_TZ).set(noonObject).toISOString();
    reservation.end = moment(end).tz(MOUNTAIN_TZ).set(noonObject).toISOString();
};
