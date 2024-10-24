import dayjs from "dayjs";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isBetween = require("dayjs/plugin/isBetween");
const config = require("config");
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const WINTER_SEASON_START_2024 = "2024-10-21";
const WINTER_SEASON_END_2024 = "2025-05-18";
const WINTER_SEASON_START_2025 = "2025-10-20";
const WINTER_SEASON_END_2025 = "2026-05-18";
const WINTER_SEASON_START_2026 = "2026-10-25";
const WINTER_SEASON_END_2026 = "2027-05-15";
const MOUNTAIN_TZ = "America/Denver";

export const validateReservation = (reservation, isAdmin) => {
  const minDate = config.get("minimumReservationDate");
  const maxReservationDate = config.get("maximumReservationDate");
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

  if (!dayjs(start).isValid()) {
    return { error: "Invalid start date" };
  }
  if (!dayjs(end).isValid()) {
    return { error: "Invalid end date" };
  }
  if (dayjs(reservation.start).isAfter(reservation.end)) {
    return { error: "Start date cannot be after end date." };
  }
  if (dayjs(start).isBefore(minDate, "day")) {
    return { error: "This reservation is too early." };
  }
  if (dayjs(end).isAfter(maxReservationDate)) {
    return {
      error:
        "At this time, reservations cannot be made after " + maxReservationDate
    };
  }
  if (!isReservationLengthValid(start, end) && !isAdmin) {
    return { error: "Invalid reservation length." };
  }
  processReserVationDates(reservation);
  return {};
};

const isReservationLengthValid = (checkinDate, checkoutDate) => {
  const dayJsCheckin = dayjs(checkinDate);
  const dayJsCheckout = dayjs(checkoutDate);
  const maxLength = isInWinter(checkinDate) ? 14 : 7;
  const minLength = 1;
  const reservationLength = dayJsCheckout.diff(dayJsCheckin, "days");
  console.log({ reservationLength });
  if (reservationLength > maxLength || reservationLength < minLength) {
    return false;
  }
  return true;
};

export const isInWinter = (date) => {
  return (
    dayjs(date).isBetween(
      WINTER_SEASON_START_2025,
      WINTER_SEASON_END_2025,
      "day"
    ) ||
    dayjs(date).isBetween(
      WINTER_SEASON_START_2026,
      WINTER_SEASON_END_2026,
      "day"
    ) ||
    dayjs(date).isBetween(
      WINTER_SEASON_START_2024,
      WINTER_SEASON_END_2024,
      "day"
    )
  );
};

const processReserVationDates = (reservation) => {
  //Default reservation times to noon
  const noonHour = 12;
  const { start, end } = reservation;
  reservation.start = dayjs(start)
    .tz(MOUNTAIN_TZ)
    .set("hour", noonHour)
    .toISOString();
  reservation.end = dayjs(end)
    .tz(MOUNTAIN_TZ)
    .set("hour", noonHour)
    .toISOString();
};
