const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isBetween = require("dayjs/plugin/isBetween");
const isoWeek = require("dayjs/plugin/isoWeek");
const objectSupport = require("dayjs/plugin/objectSupport");

dayjs.extend(objectSupport);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const noonHour = 12;
const MOUNTAIN_TZ = "America/Denver";

const reservations = [
  {
    start: dayjs("2027-05-17")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-05-17")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Shauna Hutton"
  },
  {
    start: dayjs("2027-05-24")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-05-24")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Melanie Garstenshiager"
  },
  {
    start: dayjs("2027-05-31")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-05-31")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Dwight Schipke"
  },
  {
    start: dayjs("2027-06-07")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-06-07")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Stephanie Schipke"
  },
  {
    start: dayjs("2027-06-14")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-06-14")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Kelli Wieczorek"
  },
  {
    start: dayjs("2027-06-21")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-06-21")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Denise Schipke Smeenk"
  },
  {
    start: dayjs("2027-06-28")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-06-28")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Christine Orwick"
  },
  {
    start: dayjs("2027-07-05")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-07-05")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Gale Schipke"
  },
  {
    start: dayjs("2027-07-12")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-07-12")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Jill Orwick"
  },
  {
    start: dayjs("2027-07-19")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-07-19")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Doug Albertson"
  },
  {
    start: dayjs("2027-07-26")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-07-26")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Stephanie Kuster"
  },
  {
    start: dayjs("2027-08-02")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-08-02")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Demian Heinert"
  },
  {
    start: dayjs("2027-08-09")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-08-09")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Brian Schipke"
  },
  {
    start: dayjs("2027-08-16")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-08-16")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Mike Albertson"
  },
  {
    start: dayjs("2027-08-23")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-08-23")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Dwight Schipke"
  },
  {
    start: dayjs("2027-08-30")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-08-30")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Chris Kuster"
  },
  {
    start: dayjs("2027-09-06")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-09-06")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Paul Schipke"
  },
  {
    start: dayjs("2027-09-13")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-09-13")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Mark Snoozy"
  },
  {
    start: dayjs("2027-09-20")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-09-20")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Chris Schipke"
  },
  {
    start: dayjs("2027-09-27")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-09-27")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Wendy Huft"
  },
  {
    start: dayjs("2027-10-04")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-10-04")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Steven Schipke"
  },
  {
    start: dayjs("2027-10-11")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2027-10-11")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Susan Orwick"
  }
];

module.exports = {
  reservations
};
