const { reservations } = require("../common/2025_reservations");

const getUserIdByTitle = async (knex, reservation) => {
  return knex("userprofile")
    .whereLike("name", `%${reservation.title}`)
    .column("user_id", "name")
    .then((result) => {
      reservation.user_id = result[0].user_id;
      return insertNewReservation(knex, reservation);
    });
};

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
  const reservationPromises = [];
  reservations.forEach(async (reservation) => {
    reservationPromises.push(getUserIdByTitle(knex, reservation));
  });
  console.log("Promise length: ", reservationPromises.length);
  return Promise.all(reservationPromises);
};
