const dayjs = require("dayjs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { sendWelcomeEmail } = require("../../../email/index");
const { generatePassword } = require("../seed-helpers");

const mockUsers = [
  {
    id: "2be3704b-3ab5-4cd4-9630-a056d76a2bc0",
    email: "huntshop@rushmore.com",
    profile: {
      name: "Gale Schipke",
      status: "S1",
      street: "3908 Clover St",
      city: "Rapid City",
      state: "SD",
      zipcode: "57702",
      phone: "605-718-1735"
    },
    reservations: [
      {
        start: dayjs("2022-10-03").startOf("isoWeek").toISOString(),
        end: dayjs("2022-10-03")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0
          })
          .toISOString(),
        title: "Gale Schipke",
        user_id: "2be3704b-3ab5-4cd4-9630-a056d76a2bc0"
      },
      {
        start: dayjs("2023-10-02").startOf("isoWeek").toISOString(),
        end: dayjs("2023-10-02")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0
          })
          .toISOString(),
        title: "Gale Schipke",
        user_id: "2be3704b-3ab5-4cd4-9630-a056d76a2bc0"
      }
    ]
  },
  {
    id: "eb3169b4-3935-4bf3-9feb-3acc19ea71dd",
    email: "srschipke@gmail.com",
    profile: {
      name: "Steven Schipke",
      status: "S1",
      street: "3908 Clover St",
      city: "Rapid City",
      state: "SD",
      zipcode: "57702",
      phone: "605-393-5125"
    },
    reservations: [
      {
        start: dayjs("2022-08-01").startOf("isoWeek").toISOString(),
        end: dayjs("2022-08-01")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0
          })
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0
          })
          .toISOString(),
        title: "Steven Schipke",
        user_id: "3acc19ea71dd"
      },
      {
        start: dayjs("2023-09-04").startOf("isoWeek").toISOString(),
        end: dayjs("2023-09-05").endOf("isoWeek").toISOString(),
        title: "Steven Schipke",
        user_id: "eb3169b4-3935-4bf3-9feb-3acc19ea71dd"
      }
    ]
  },
  {
    id: "nf4ec5cf-67da-4729-b34d-49e409693695",
    email: "swschipke@gmail.com",
    profile: {
      status: "D1",
      name: "Scott Schipke"
    },
    reservations: []
  },
  {
    id: "c81ec5cf-67da-4729-b34d-49e409693695",
    email: "spkulehas@gmail.com",
    profile: {
      status: "ADMIN",
      name: "Schipke SpKuLeHaS"
    },
    reservations: []
  }
];

const createUser = async (knex, user) => {
  user.password = generatePassword();
  return sendWelcomeEmail(user)
    .then(() => {
      const { email, password, id } = user;
      const hash = bcrypt.hashSync(password, saltRounds);
      return knex("user").insert(
        {
          email,
          password: hash,
          id
        },
        "id"
      );
    })

    .catch((err) => {
      console.error("ERR: ", err);
      throw new Error("Error in createUser ", err);
    })
    .then(() => {
      let reservationPromises = [];
      user.reservations.forEach((reservation) => {
        reservationPromises.push(
          createReservations(knex, reservation, user.id)
        );
      });
      return Promise.all(reservationPromises);
    })
    .catch((err) => {
      console.error("97: ", err);
      throw new Error("Error on 99: ", err);
    })
    .then(() => {
      const { profile } = user;
      return createProfile(knex, profile, user.id);
    })
    .catch((err) => {
      console.error("104", err);
      throw new Error("104", err);
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Errror creating user", error);
    });
};

const createReservations = (knex, reservation, user_id) => {
  const { start, title, end } = reservation;
  return knex("reservation")
    .insert({
      notes: "",
      start,
      end,
      title,
      user_id
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Error creating reservations", error);
    });
};

const createProfile = (knex, profile, user_id) => {
  const { name, status, street, city, state, zipcode, phone } = profile;
  return knex("userprofile")
    .insert(
      {
        name,
        status,
        user_id,
        street,
        city,
        state,
        zipcode,
        phone
      },
      "id"
    )
    .catch((error) => {
      throw new Error("Error creating profile", error);
    });
};

exports.seed = function (knex) {
  return knex("userprofile")
    .del()
    .then(() => knex("reservation").del())
    .then(() => knex("session").del())
    .then(() => knex("email_setting").del())
    .then(() => knex("user").del())
    .then(() => {
      let userPromises = [];
      mockUsers.forEach((user) => {
        userPromises.push(createUser(knex, user));
      });
      return Promise.all(userPromises);
    })
    .catch((err) => {
      throw new Error("Error creating users", err);
    });
};
