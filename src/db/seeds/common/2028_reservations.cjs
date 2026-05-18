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
    start: dayjs("2028-05-15")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-05-15")
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
    start: dayjs("2028-05-22")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-05-22")
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
    start: dayjs("2028-05-29")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-05-29")
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
    start: dayjs("2028-06-05")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-06-05")
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
    start: dayjs("2028-06-12")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-06-12")
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
  },
  {
    start: dayjs("2028-06-19")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-06-19")
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
    start: dayjs("2028-06-26")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-06-26")
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
    start: dayjs("2028-07-03")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-07-03")
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
    start: dayjs("2028-07-10")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-07-10")
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
    start: dayjs("2028-07-17")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-07-17")
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
    start: dayjs("2028-07-24")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-07-24")
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
    start: dayjs("2028-07-31")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-07-31")
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
    start: dayjs("2028-08-07")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-08-07")
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
    start: dayjs("2028-08-14")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-08-14")
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
    start: dayjs("2028-08-21")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-08-21")
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
    start: dayjs("2028-08-28")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-08-28")
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
    start: dayjs("2028-09-04")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-09-04")
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
    start: dayjs("2028-09-11")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-09-11")
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
    start: dayjs("2028-09-18")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-09-18")
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
    start: dayjs("2028-09-25")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-09-25")
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
    start: dayjs("2028-10-02")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-10-02")
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
    start: dayjs("2028-10-09")
      .startOf("isoWeek")
      .set("hour", noonHour)
      .toISOString(),
    end: dayjs("2028-10-09")
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
  }
];

module.exports = {
  reservations
};
