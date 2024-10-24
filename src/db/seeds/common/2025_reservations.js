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
    start: dayjs("2025-05-19")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-05-19")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Melany Garstenshlager"
  },
  {
    start: dayjs("2025-05-26")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-05-26")
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
    start: dayjs("2025-06-02")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-06-02")
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
    start: dayjs("2025-06-09")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-06-09")
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
    start: dayjs("2025-06-16")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-06-16")
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
    start: dayjs("2025-06-23")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-06-23")
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
    start: dayjs("2025-06-30")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-06-30")
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
    start: dayjs("2025-07-07")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-07-07")
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
    start: dayjs("2025-07-14")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-07-14")
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
    start: dayjs("2025-07-21")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-07-21")
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
    start: dayjs("2025-07-28")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-07-28")
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
    start: dayjs("2025-08-04")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-08-04")
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
    start: dayjs("2025-08-11")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-08-11")
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
    start: dayjs("2025-08-18")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-08-18")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Denise Smeenk"
  },
  {
    start: dayjs("2025-08-25")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-08-25")
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
    start: dayjs("2025-09-01")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-09-01")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Dick Kuster"
  },
  {
    start: dayjs("2025-09-08")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-09-08")
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
    start: dayjs("2025-09-15")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-09-15")
      .endOf("isoWeek")
      .tz(MOUNTAIN_TZ)
      .set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      .toISOString(),
    title: "Sue Orwick"
  },
  {
    start: dayjs("2025-09-22")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-09-22")
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
    start: dayjs("2025-09-29")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-09-29")
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
    start: dayjs("2025-10-06")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-10-06")
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
    start: dayjs("2025-10-13")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2025-10-13")
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
  }
];

module.exports = {
  reservations
};
