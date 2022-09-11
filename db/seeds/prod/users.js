const moment = require("moment");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;
const { sendWelcomeEmail } = require("../../../email/index");
const { generatePassword } = require("../seed-helpers");

const mockUsers = [
  {
    id: uuidv4(),
    email: "ajschipke@gmail.com",
    profile: {
      name: "AJ Schipke",
      status: "D1",
      street: "12608 Carland Place",
      city: "Laurel",
      state: "MD",
      zipcode: "20708",
      phone: "443-248-0718",
    },
    reservations: [],
  },
  {
    id: "4a9f8b3c-436b-43f2-b92a-275168fabe8d",
    email: "bradschipke86.com",
    profile: {
      name: "Brad Schipke",
      status: "D1",
      street: "1109 CR 51 Lot 2",
      city: "Myrtle",
      state: "MS",
      zipcode: "38650",
      phone: "662-231-3216",
    },
    reservations: [],
  },
  {
    id: uuidv4(),
    email: "bschipke@gmail.com",
    profile: {
      name: "Brian Schipke",
      status: "D1",
      street: "3675 Point of Rocks DR",
      city: "Colorado Springs",
      state: "CO",
      zipcode: "80918",
      phone: "719-532-1201",
    },
    reservations: [
      {
        start: moment("2022-09-05")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-09-05")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Brian Schipke",
      },
      {
        start: moment("2023-06-05")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-06-05")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Brian Schipke",
      },
      {
        start: moment("2024-08-05")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-08-05")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Brian Schipke",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "jillorwick@yahoo.com",
    profile: {
      name: "Jill Orwick",
      status: "D1",
      street: "7502 Whistle Stop Dr",
      city: "Austin",
      state: "TX",
      zipcode: "78749",
      phone: "512-284-8528",
    },
    reservations: [
      {
        start: moment("2022-08-22")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-08-22")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Jill Orwick",
      },
      {
        start: moment("2023-07-17")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-07-17")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Jill Orwick",
      },
      {
        start: moment("2023-07-17")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-07-17")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Jill Orwick",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "kimberly.schipke@gmail.com",
    profile: {
      name: "Kimberly Schipke",
      status: "D1",
      street: "4081 Old Town Circle",
      city: "Tupelo",
      state: "MS",
      zipcode: "38804",
      phone: "662-213-8941",
    },
  },
  {
    id: uuidv4(),
    email: "toomuchtodo3015@yahoo.com",
    profile: {
      name: "Melanie Garstenshiager",
      status: "D1",
      street: "4375 Vinecliff Drive",
      city: "Rapid City",
      state: "SD",
      zipcode: "57703",
      phone: "605-391-0678",
    },
    reservations: [
      {
        start: moment("2022-06-06")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-06-06")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Melanie Garstenshiager",
      },
      {
        start: moment("2023-10-16")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-10-16")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Melanie Garstenshiager",
      },
      {
        start: moment("2024-06-10")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-06-10")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Melanie Garstenshiager",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "pschipke2@gmail.com",
    profile: {
      name: "Paulina Schipke",
      status: "D1",
      street: "1835 Vallejo St  APT 106",
      city: "San Francisco",
      state: "CA",
      zipcode: "94123",
      phone: "605-490-3170",
    },
  },
  {
    id: uuidv4(),
    email: "swschipke@gmail.com",
    profile: {
      name: "Scott Schipke",
      status: "D1",
      street: "755 S Dexter St #118",
      city: "Denver",
      state: "CO",
      zipcode: "80246",
      phone: "605-431-9294",
    },
  },
  {
    id: uuidv4(),
    email: "shad.schipke@gmail.com",
    profile: {
      name: "Shad Schipke",
      status: "D1",
      street: "64 County Rd 188",
      city: "Louin",
      state: "MS",
      zipcode: "39338",
      phone: "662-871-3205",
    },
  },
  {
    id: uuidv4(),
    email: "schipke13@yahoo.com",
    profile: {
      name: "Shauna Schipke",
      status: "D1",
      street: "3444 Meadow Grove",
      city: "Zachary",
      state: "LA",
      zipcode: "70791",
      phone: "662-722-0547",
    },
  },
  {
    id: uuidv4(),
    email: "stephschipke@sbcglobal.net",
    profile: {
      name: "Stephanie Schipke",
      status: "D1",
      street: "2472 Tung Nguyen Lane",
      city: "Tracy",
      state: "CA",
      zipcode: "95376",
      phone: "925-548-0458",
    },
    reservations: [
      {
        start: moment("2022-09-19")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-09-19")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Stephanie Schipke",
      },
      {
        start: moment("2023-09-18")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-09-18")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Stephanie Schipke",
      },
      {
        start: moment("2024-07-15")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-07-15")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Stephanie Schipke",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "nikki_heinert@hotmail.com",
    profile: {
      name: "Nikita Heinert",
      status: "D2",
      street: "NA",
      city: "NA",
      state: "",
      zipcode: "NA",
      phone: "605-858-3848",
    },
  },
  {
    id: uuidv4(),
    email: "christopher.kuster@gmail.com",
    profile: {
      name: "Chris Kuster",
      status: "S1",
      street: "8118 Blackton Road, Apt 410",
      city: "Madison",
      state: "WI",
      zipcode: "53719",
      phone: "608-497-1570",
    },
    reservations: [
      {
        start: moment("2022-10-10")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-10-10")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Chris Kuster",
      },
      {
        start: moment("2023-08-07")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-08-07")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Chris Kuster",
      },
      {
        start: moment("2024-05-27")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-05-27")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Chris Kuster",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "cpschipke@yahoo.com",
    profile: {
      name: "Chris Schipke",
      status: "S1",
      street: "11073 Cannonade Lane",
      city: "Parker",
      state: "CO",
      zipcode: "80138",
      phone: "720-420-9695",
    },
    reservations: [
      {
        start: moment("2022-06-20")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-06-20")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Chris Schipke",
      },
      {
        start: moment("2023-07-03")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-07-03")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Chris Schipke",
      },
      {
        start: moment("2024-08-26")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-08-26")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Chris Schipke",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "ckorwick@yahoo.com",
    profile: {
      name: "Christine Orwick",
      status: "S1",
      street: "8000 Elk Creek Road",
      city: "Piedmont",
      state: "SD",
      zipcode: "57769",
      phone: "605-209-8769",
    },
    reservations: [
      {
        start: moment("2022-08-08")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-08-08")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Christine Orwick",
      },
      {
        start: moment("2023-09-11")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-09-11")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Christine Orwick",
      },
      {
        start: moment("2024-09-30")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-09-30")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Christine Orwick",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "dbheinert76@gmail.com",
    profile: {
      name: "Demian Heinert",
      status: "S1",
      street: "18291 Winkler Road",
      city: "Newell",
      state: "SD",
      zipcode: "57760",
      phone: "605-569-6675",
    },
    reservations: [
      {
        start: moment("2022-08-15")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-08-15")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Demian Heinert",
      },
      {
        start: moment("2023-08-21")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-08-21")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Demian Heinert",
      },
      {
        start: moment("2024-09-23")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-09-23")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Demian Heinert",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "dsmeenk@hotmail.com",
    profile: {
      name: "Denise Smeenk",
      status: "S1",
      street: "18291 Winkler Road",
      city: "Newell",
      state: "SD",
      zipcode: "57760",
      phone: "605-456-2419",
    },
    reservations: [
      {
        start: moment("2022-05-23")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-05-23")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        allDay: true,
        title: "Denise Smeenk",
      },
      {
        start: moment("2023-07-24")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-07-24")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        allDay: true,
        title: "Denise Smeenk",
      },
      {
        start: moment("2024-07-01")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-07-01")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        allDay: true,
        title: "Denise Smeenk",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "kick.duster46@gmail.com",
    profile: {
      name: "Dick Kuster",
      status: "S1",
      street: "1006 Pinecrest St",
      city: "Riverton",
      state: "WY",
      zipcode: "82501",
      phone: "307-856-6617",
    },
    reservations: [
      {
        start: moment("2022-07-11")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-07-11")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dick Kuster",
      },
      {
        start: moment("2023-07-31")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-07-31")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dick Kuster",
      },
      {
        start: moment("2024-09-16")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-09-16")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dick Kuster",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "dalbertson@goldenwest.net",
    profile: {
      name: "Doug Albertson",
      status: "S1",
      street: "18301 E. HWY 44",
      city: "Scenic",
      state: "SD",
      zipcode: "57780",
      phone: "605-786-6536",
    },
    reservations: [
      {
        start: moment("2022-06-27")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-06-27")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Doug Albertson",
      },
      {
        start: moment("2023-05-22")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-05-22")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Doug Albertson",
      },
      {
        start: moment("2024-08-19")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-08-19")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Doug Albertson",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "lksnoozy@aol.com",
    profile: {
      name: "Kandee Snoozy",
      status: "S1",
      street: "4201 Wonderland Drive",
      city: "Rapid City",
      state: "SD",
      zipcode: "57702",
      phone: "605-388-0328",
    },
  },
  {
    id: uuidv4(),
    email: "malbertson@hsami.com",
    profile: {
      name: "Mike Albertson",
      status: "S1",
      street: "14852 W. Hearn Road",
      city: "Surprise",
      state: "AZ",
      zipcode: "85379",
      phone: "623-376-2357",
    },
    reservations: [
      {
        start: moment("2022-07-25")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-07-25")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Mike Albertson",
      },
      {
        start: moment("2023-09-25")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-09-25")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Mike Albertson",
      },
      {
        start: moment("2024-08-12")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-08-12")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Mike Albertson",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "jpschipke@gmail.com",
    profile: {
      name: "Paul Schipke",
      status: "S1",
      street: "PO Box 444",
      city: "Deadwood",
      state: "SD",
      zipcode: "57732",
      phone: "605-578-3276",
    },
    reservations: [
      {
        start: moment("2022-05-30")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-05-30")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Paul Schipke",
      },
      {
        start: moment("2023-10-09")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-10-09")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Paul Schipke",
      },
      {
        start: moment("2024-07-22")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-07-22")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Paul Schipke",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "srkuster406@gmail.com",
    profile: {
      name: "Stephanie Kuster",
      status: "S1",
      street: "804 Logan #1",
      city: "Helena",
      state: "MT",
      zipcode: "59601",
      phone: "406-461-3359",
    },
    reservations: [
      {
        start: moment("2022-06-13")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-06-13")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Stephanie Kuster",
      },
      {
        start: moment("2023-05-29")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-05-29")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Stephanie Kuster",
      },
      {
        start: moment("2024-06-17")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-06-17")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Stephanie Kuster",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "srschipke@gmail.com",
    profile: {
      name: "Steven Schipke",
      status: "S1",
      street: "12321 Ruby Rd",
      city: "Black Hawk",
      state: "SD",
      zipcode: "57719",
      phone: "605-393-5125",
    },
    reservations: [
      {
        start: moment("2022-07-04")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-07-04")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Steven Schipke",
      },
      {
        start: moment("2023-08-28")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-08-28")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Steven Schipke",
      },
      {
        start: moment("2024-10-07")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-10-07")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Steven Schipke",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "sorwick3@gmail.com",
    profile: {
      name: "Sue Orwick",
      status: "S1",
      street: "8000 Elk Creek Road",
      city: "Piedmont",
      state: "SD",
      zipcode: "57769",
      phone: "605-787-6462",
    },
    reservations: [
      {
        start: moment("2022-10-17")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-10-17")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Sue Orwick",
      },
      {
        start: moment("2023-06-26")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-06-26")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Sue Orwick",
      },
      {
        start: moment("2024-05-20")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-05-20")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Sue Orwick",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "kelli.wieczorek@gmail.com",
    profile: {
      name: "Kelli Wieczorek",
      status: "S1",
      street: "5415 Stone Tree Court",
      city: "Piedmont",
      state: "SD",
      zipcode: "57769",
      phone: "605-787-6927",
    },
    reservations: [
      {
        start: moment("2022-09-12")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-09-12")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Kelli Wieczorek",
      },
      {
        start: moment("2023-06-19")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-06-19")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Kelli Wieczorek",
      },
      {
        start: moment("2024-06-03")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-06-03")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Kelli Wieczorek",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "mississippiqueen@gmail.com",
    profile: {
      name: "Wendy Huft",
      status: "S1",
      street: "1427 Hawthorn Place",
      city: "Richmond Heights",
      state: "MO",
      zipcode: "63117",
      phone: "303-803-2580",
    },
    reservations: [
      {
        start: moment("2022-07-18")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-07-18")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Wendy Huft",
      },
      {
        start: moment("2023-06-12")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-06-12")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Wendy Huft",
      },
      {
        start: moment("2024-07-29")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-07-29")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Wendy Huft",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "severson@pitt.edu",
    profile: {
      name: "Dessie Severson",
      status: "S2",
      street: "7612 Lindberg Drive",
      city: "Richmond Heights",
      state: "MO",
      zipcode: "63117",
      phone: "505-800-1631",
    },
  },
  {
    id: uuidv4(),
    email: "schipkedwight.823@gmail.com",
    profile: {
      name: "Dwight Schipke",
      status: "S2",
      street: "4081 Old Town Circle",
      city: "Tupelo",
      state: "MS",
      zipcode: "38804",
      phone: "662-255-8942",
    },
    reservations: [
      {
        start: moment("2022-08-29")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-08-29")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dwight Schipke",
      },
      {
        start: moment("2022-09-26")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-09-26")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dwight Schipke",
      },
      {
        start: moment("2023-07-10")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-07-10")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dwight Schipke",
      },
      {
        start: moment("2023-08-14")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-08-14")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dwight Schipke",
      },
      {
        start: moment("2024-06-24")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-06-24")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dwight Schipke",
      },
      {
        start: moment("2024-07-08")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-07-08")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Dwight Schipke",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "speiceb3@yahoo.com",
    profile: {
      name: "Chip Speice",
      status: "U",
      street: "22 Homed Lark Place",
      city: "Spring",
      state: "TX",
      zipcode: "77389",
      phone: "832-492-8009",
    },
  },
  {
    id: uuidv4(),
    email: "lcasavan@whitecars.com",
    profile: {
      name: "Lori Casavan",
      status: "U",
      street: "1419 Birnam Wood Lane",
      city: "Belle Fourche",
      state: "SD",
      zipcode: "57717",
      phone: "605-645-0613",
    },
  },
  {
    id: uuidv4(),
    email: "mitzi.miles.fisher@gmail.com",
    profile: {
      name: "Mitzi Miles",
      status: "U",
      street: "3536 Sierra Place, APT D",
      city: "Rapid City",
      state: "SD",
      zipcode: "57702",
      phone: "707-812-8949",
    },
  },
  {
    id: uuidv4(),
    email: "sarnurse@gwtc.net",
    profile: {
      name: "Sally Rall",
      status: "U",
      street: "27245 Highway 79",
      city: "Buffalo Gap",
      state: "SD",
      zipcode: "57722",
      phone: "605-833-2225",
    },
  },
  {
    id: uuidv4(),
    email: "susan.kuster@gmail.com",
    profile: {
      name: "Susan Kuster",
      status: "U",
      street: "RR 1 Box 75",
      city: "Seaton",
      state: "IL",
      zipcode: "61476",
      phone: "309-586-6151",
    },
  },
  {
    id: uuidv4(),
    email: "huntshop@rushmore.com",
    profile: {
      name: "Gale Schipke",
      status: "S1",
      street: "3908 Clover St",
      city: "Rapid City",
      state: "SD",
      zipcode: "57702",
      phone: "605-718-1735",
    },
    reservations: [
      {
        start: moment("2022-10-03")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-10-03")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Gale Schipke",
      },
      {
        start: moment("2023-10-02")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-10-02")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Gale Schipke",
      },
      {
        start: moment("2024-09-02")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-09-02")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Gale Schipke",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "marksnoozy@hotmail.com",
    profile: {
      name: "Mark Snoozy",
      status: "S1",
      street: "52 Nassau Blvd",
      city: "Malberne",
      state: "NY",
      zipcode: "11565",
      phone: "516-353-8266",
    },
    reservations: [
      {
        start: moment("2022-08-01")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-08-01")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Mark Snoozy",
      },
      {
        start: moment("2023-09-04")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-09-04")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Mark Snoozy",
      },
      {
        start: moment("2024-09-09")
          .startOf("isoWeek")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-09-09")
          .endOf("isoWeek")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        title: "Mark Snoozy",
      },
    ],
  },
  {
    id: uuidv4(),
    email: "spkulehas@gmail.com",
    profile: {
      status: "ADMIN",
      name: "Schipke SpKuLeHaS",
    },
    reservations: [
      {
        notes: "During deer hunting season the cabin is open to all.",
        title: "Open For Hunters",
        start: moment("2022-11-01")
          .startOf("isoMonth")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-11-30")
          .endOf("isoMonth")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
      },
      {
        notes: "During deer hunting season the cabin is open to all.",
        title: "Open For Hunters",
        start: moment("2023-11-01")
          .startOf("isoMonth")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-11-30")
          .endOf("isoMonth")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
      },
      {
        notes: "During deer hunting season the cabin is open to all.",
        title: "Open For Hunters",
        start: moment("2024-11-01")
          .startOf("isoMonth")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-11-30")
          .endOf("isoMonth")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
      },
      {
        notes: "During deer hunting season the cabin is open to all.",
        title: "Open For Hunters",
        start: moment("2025-11-01")
          .startOf("isoMonth")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2025-11-30")
          .endOf("isoMonth")
          .set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
      },
      {
        start: moment("2022-05-21")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2022-05-21")
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
        start: moment("2023-05-20")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2023-05-20")
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
        start: moment("2024-05-18")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2024-05-18")
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
        start: moment("2025-05-17")
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .toISOString(),
        end: moment("2025-05-17")
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
    ],
  },
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
          id,
        },
        "id"
      );
    })
    .catch((err) => {
      console.log("ERR: ", err);
      throw new Error("Error in createUser ", err);
    })
    .then(() => {
      console.log("98");
      const { profile } = user;
      console.log({ profile });
      return createProfile(knex, profile, user.id);
    })
    .catch((err) => console.error("Error seeding profile: ", err))
    .then(() => {
      if (user["reservations"] && user["reservations"].length) {
        console.log("90");
        let reservationPromises = [];
        user.reservations.forEach((reservation) => {
          reservationPromises.push(
            createReservations(knex, reservation, user.id)
          );
        });
        return Promise.all(reservationPromises);
      }
    })
    .catch((err) => {
      console.error("97: ", err);
      throw new Error("Error on 99: ", err);
    })
    .catch((err) => {
      console.log("104", err);
      throw new Error("104", err);
    })
    .catch((error) => {
      console.error(err);
      throw new Error("Errror creating user", error);
    });
};

const createReservations = (knex, reservation, userId) => {
  const { start, title, end, notes } = reservation;
  console.log({ reservation });
  return knex("reservation")
    .insert({
      notes: notes ? notes : "",
      start,
      end,
      title,
      user_id: userId,
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
        phone,
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
