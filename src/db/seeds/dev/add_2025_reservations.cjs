const { reservations } = require("../common/2025_reservations.cjs");
const { resolveUserIdForTitle } = require("../common/reservationSeedHelpers.cjs");

const insertNewReservation = async (knex, reservation) => {
  console.log("RESERVATION TO INSERT: ", reservation);
  const { start, title, end, user_id } = reservation;
  return knex("reservation").insert({
    start,
    end,
    title,
    user_id
  });
};

exports.seed = async function (knex) {
  console.log("# of reservations: ", reservations.length);
  const reservationPromises = reservations.map(async (reservation) => {
    reservation.user_id = await resolveUserIdForTitle(knex, reservation.title);
    return insertNewReservation(knex, reservation);
  });
  console.log("Promise length: ", reservationPromises.length);
  return Promise.all(reservationPromises);
};
