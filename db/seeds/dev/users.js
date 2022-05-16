const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { copyUser, resetPassFile } = require("../../../utils/filewriter");

const generatePassword = () => {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).toUpperCase().slice(2)
  );
};

const mockUsers = [
  {
    id: "43504625-114f-40c3-a4f0-fe084fbcccc3",
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
    id: "2a6481a9-0bae-4caf-bbcb-65365fbda2fa",
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
        user_id: "2a6481a9-0bae-4caf-bbcb-65365fbda2fa",
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
        user_id: "2a6481a9-0bae-4caf-bbcb-65365fbda2fa",
      },
    ],
  },
  {
    id: "b7e8648a-3659-4faf-b361-0ac91dd9c67d",
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
        user_id: "b7e8648a-3659-4faf-b361-0ac91dd9c67d",
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
        user_id: "b7e8648a-3659-4faf-b361-0ac91dd9c67d",
      },
    ],
  },
  {
    id: "f1b2d983-e9a9-45a8-9d40-fde6b3b3d6a6",
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
    id: "a98e122d-ecde-445a-9a25-9aaa49d3e53a",
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
        user_id: "a98e122d-ecde-445a-9a25-9aaa49d3e53a",
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
        user_id: "a98e122d-ecde-445a-9a25-9aaa49d3e53a",
      },
    ],
  },
  {
    id: "9db90749-46b3-4aeb-831a-cc1a0faacfb1",
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
    id: "e48de300-affb-40a0-88bf-e39e14126ab5",
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
    id: "c8ed7f44-b311-41a0-a869-e6da816213c1",
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
    id: "7f364309-900c-4a86-8d06-e3b21c3ac6cc",
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
    id: "b7e78347-aacd-4fbb-ae9d-23b6e1e7f993",
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
        user_id: "b7e78347-aacd-4fbb-ae9d-23b6e1e7f993",
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
        user_id: "b7e78347-aacd-4fbb-ae9d-23b6e1e7f993",
      },
    ],
  },
  {
    id: "540d24e1-f41d-4063-b7e3-4ac7fe879086",
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
    id: "272ee54e-5ba8-4cf8-ab6d-bdf9032b7b5a",
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
        user_id: "272ee54e-5ba8-4cf8-ab6d-bdf9032b7b5a",
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
        user_id: "272ee54e-5ba8-4cf8-ab6d-bdf9032b7b5a",
      },
    ],
  },
  {
    id: "8b08c91b-5e37-47d1-a11b-0bef3a10fbdd",
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
        user_id: "8b08c91b-5e37-47d1-a11b-0bef3a10fbdd",
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
        user_id: "8b08c91b-5e37-47d1-a11b-0bef3a10fbdd",
      },
    ],
  },
  {
    id: "3b814266-9b58-4e25-aae6-cde737e526ed",
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
        user_id: "3b814266-9b58-4e25-aae6-cde737e526ed",
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
        user_id: "3b814266-9b58-4e25-aae6-cde737e526ed",
      },
    ],
  },
  {
    id: "c563409e-e4d1-49c7-99e9-873d094ce9cc",
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
        user_id: "c563409e-e4d1-49c7-99e9-873d094ce9cc",
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
        user_id: "c563409e-e4d1-49c7-99e9-873d094ce9cc",
      },
    ],
  },
  {
    id: "2a778ee1-0dff-4633-a825-c58fedf30684",
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
        user_id: "2a778ee1-0dff-4633-a825-c58fedf30684",
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
        user_id: "2a778ee1-0dff-4633-a825-c58fedf30684",
      },
    ],
  },
  {
    id: "1f591ff2-0c55-460e-bd01-1c1b1294ad6a",
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
        user_id: "1f591ff2-0c55-460e-bd01-1c1b1294ad6a",
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
        user_id: "1f591ff2-0c55-460e-bd01-1c1b1294ad6a",
      },
    ],
  },
  {
    id: "371e0b1b-1a85-4d0d-830e-499786ef7e9f",
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
        user_id: "371e0b1b-1a85-4d0d-830e-499786ef7e9f",
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
        user_id: "371e0b1b-1a85-4d0d-830e-499786ef7e9f",
      },
    ],
  },
  {
    id: "37988020-92e0-438f-b9dd-011662c0bab6",
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
    id: "7ce93aa0-1b60-4d1a-926a-2cc87c2f41fe",
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
        user_id: "7ce93aa0-1b60-4d1a-926a-2cc87c2f41fe",
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
        user_id: "7ce93aa0-1b60-4d1a-926a-2cc87c2f41fe",
      },
    ],
  },
  {
    id: "864ea051-2610-4f62-88b0-29f50df3f3d2",
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
        user_id: "864ea051-2610-4f62-88b0-29f50df3f3d2",
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
        user_id: "864ea051-2610-4f62-88b0-29f50df3f3d2",
      },
    ],
  },
  {
    id: "23266588-7773-438d-83eb-1a84d0c72245",
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
        user_id: "23266588-7773-438d-83eb-1a84d0c72245",
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
        user_id: "23266588-7773-438d-83eb-1a84d0c72245",
      },
    ],
  },
  {
    id: "eb3169b4-3935-4bf3-9feb-3acc19ea71dd",
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
        user_id: "eb3169b4-3935-4bf3-9feb-3acc19ea71dd",
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
        user_id: "eb3169b4-3935-4bf3-9feb-3acc19ea71dd",
      },
    ],
  },
  {
    id: "5ddcc094-c9e2-4a59-9378-9bbfb92ac1b2",
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
        user_id: "5ddcc094-c9e2-4a59-9378-9bbfb92ac1b2",
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
        user_id: "5ddcc094-c9e2-4a59-9378-9bbfb92ac1b2",
      },
    ],
  },
  {
    id: "8b609a69-902b-4891-8d33-4b598c1076a8",
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
        user_id: "8b609a69-902b-4891-8d33-4b598c1076a8",
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
        user_id: "8b609a69-902b-4891-8d33-4b598c1076a8",
      },
    ],
  },
  {
    id: "37157f68-c779-4838-8793-e0c5d4a69267",
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
        user_id: "37157f68-c779-4838-8793-e0c5d4a69267",
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
        user_id: "37157f68-c779-4838-8793-e0c5d4a69267",
      },
    ],
  },
  {
    id: "6a50f6a7-89a1-4a0f-b602-8a1352a0ccf9",
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
    id: "2a28e790-46ad-49c2-b6b6-836161477a9d",
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
        user_id: "2a28e790-46ad-49c2-b6b6-836161477a9d",
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
        user_id: "2a28e790-46ad-49c2-b6b6-836161477a9d",
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
        user_id: "2a28e790-46ad-49c2-b6b6-836161477a9d",
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
        user_id: "2a28e790-46ad-49c2-b6b6-836161477a9d",
      },
    ],
  },
  {
    id: "6997c395-01b7-4b34-8a17-c3dbaed5ef9a",
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
    id: "dafc838e-838b-4971-9248-88abc567680f",
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
    id: "6e66a369-f14c-4a52-a6ce-95c3266978df",
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
    id: "321f9fca-fd05-49cf-ad5c-f36c78382bba",
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
    id: "e2cf29d9-4a7b-4f80-9771-ad524a725255",
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
    id: "2be3704b-3ab5-4cd4-9630-a056d76a2bc0",
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
        user_id: "2be3704b-3ab5-4cd4-9630-a056d76a2bc0",
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
        user_id: "2be3704b-3ab5-4cd4-9630-a056d76a2bc0",
      },
    ],
  },
  {
    id: "6e81bb50-e350-4c87-928e-14c373a6eb3f",
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
        user_id: "6e81bb50-e350-4c87-928e-14c373a6eb3f",
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
        user_id: "6e81bb50-e350-4c87-928e-14c373a6eb3f",
      },
    ],
  },
  {
    id: "c81ec5cf-67da-4729-b34d-49e409693695",
    email: "spkulehas@gmail.com",
    profile: {
      status: "ADMIN",
      name: "Schipke SpKuLeHaS",
    },
    reservations: [],
  },
];

const createUser = async (knex, user) => {
  console.log({ user });
  user.password = generatePassword();
  copyUser(user);
  const { email, password, id } = user;
  const hash = bcrypt.hashSync(password, saltRounds);
  return knex("user")
    .insert(
      {
        email,
        password: hash,
        id,
      },
      "id"
    )
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
    .catch((err) => console.error("Error executing profile: ", err))
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

const createReservations = (knex, reservation, user_id) => {
  const { start, title, end } = reservation;
  console.log({ reservation });
  return knex("reservation")
    .insert({
      notes: "",
      start,
      end,
      title,
      user_id,
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
  console.log("128");
  resetPassFile();
  return knex("userprofile")
    .del()
    .then(() => knex("reservation").del())
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
