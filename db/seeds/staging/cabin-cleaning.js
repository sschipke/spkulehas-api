const dayjs = require("dayjs");

const cabinCleanings = [
  {
    start: dayjs("2022-05-21")
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    end: dayjs("2022-05-21")
      .set({
        hour: 20,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    title: "Cabin Cleaning",
    notes: "Cabin cleaning and anual board meeting.",
  },
  {
    start: dayjs("2023-05-20")
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    end: dayjs("2023-05-20")
      .set({
        hour: 20,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    title: "Cabin Cleaning",
    notes: "Cabin cleaning and anual board meeting.",
  },
  {
    start: dayjs("2024-05-18")
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    end: dayjs("2024-05-18")
      .set({
        hour: 20,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    title: "Cabin Cleaning",
    notes: "Cabin cleaning and anual board meeting.",
  },
  {
    start: dayjs("2025-05-17")
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    end: dayjs("2025-05-17")
      .set({
        hour: 20,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString(),
    title: "Cabin Cleaning",
    notes: "Cabin cleaning and anual board meeting.",
  }
];

exports.seed = function (knex) {
  return knex("user")
    .where({ email: "spkulehas@gmail.com" })
    .columns(["id"])
    .first()
    .then(({ id }) => {
      const reservationsWithUserIds = cabinCleanings.map((reservation) => {
        reservation.user_id = id;
        return reservation;
      });
      console.log(reservationsWithUserIds);
      return knex("reservation").insert(reservationsWithUserIds);
    });
};
