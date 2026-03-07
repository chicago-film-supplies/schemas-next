import { assertEquals } from "@std/assert";
import { HolidayDatesSchema } from "../src/holiday-dates.ts";

Deno.test("HolidayDatesSchema validates a complete document", () => {
  const doc = {
    uid: "hd-1",
    uid_holiday: "holiday-1",
    date: "2026-12-25",
    name: "Christmas Day",
    type: "fixed",
  };
  assertEquals(HolidayDatesSchema.safeParse(doc).success, true);
});

Deno.test("HolidayDatesSchema accepts variable type", () => {
  const doc = {
    uid: "hd-2",
    uid_holiday: "holiday-2",
    date: "2026-04-05",
    name: "Easter Sunday",
    type: "variable",
  };
  assertEquals(HolidayDatesSchema.safeParse(doc).success, true);
});

Deno.test("HolidayDatesSchema rejects invalid type", () => {
  const doc = {
    uid: "hd-1",
    uid_holiday: "h-1",
    date: "2026-01-01",
    name: "New Year",
    type: "unknown",
  };
  assertEquals(HolidayDatesSchema.safeParse(doc).success, false);
});

Deno.test("HolidayDatesSchema rejects additional properties", () => {
  const doc = {
    uid: "hd-1",
    uid_holiday: "h-1",
    date: "2026-01-01",
    name: "New Year",
    type: "fixed",
    bogus: true,
  };
  assertEquals(HolidayDatesSchema.safeParse(doc).success, false);
});
