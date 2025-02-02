const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
dayjs.extend(timezone);

const updateStartHour = async (knex, id, startTimeStamp, title) => {
  const noonHour = 12;
  const MOUNTAIN_TZ = "America/Denver";
  console.log("Incoming reservation: ", "id: ", id, { startTimeStamp }, title);
  const noonStartHour = dayjs(startTimeStamp)
    .tz(MOUNTAIN_TZ)
    .set("hour", noonHour)
    .toISOString();
  console.log("New start time: ", { noonStartHour });
  return knex("reservation")
    .where({ id })
    .update({ start: noonStartHour })
    .catch((error) => {
      console.error(
        "Error updating reservation: ",
        id,
        "start",
        startTimeStamp,
        "title: ",
        title
      );
      console.error("Error: ", error);
      throw new Error("Unable to update reservation: " + id);
    });
};

exports.up = function (knex) {
  return Promise.all([
    knex("reservation")
      .columns("id", "start", "title")
      .then((reservations) => {
        const reservationsToUpdate = [];
        reservations.forEach((reservation) => {
          const { id, start, title } = reservation;
          reservationsToUpdate.push(updateStartHour(knex, id, start, title));
        });
        console.log("Total updated: ", reservationsToUpdate.length);
        return Promise.all(reservationsToUpdate);
      })
      .catch((err) => {
        console.error("Error in migrating noon hour update: ", err);
        throw new Error("Unable to perform noon hour update.");
      })
  ]);
};

// eslint-disable-next-line no-unused-vars
exports.down = function (knex) {
  console.warn("Rolling back noon hour update.");
};
