import { createDatesListRecursive } from "./createDatesListRecursive.js";

test("creates dates from start to end", () => {
  expect(
    createDatesListRecursive([], "30.12.2020", "02.01.2021")
  ).toStrictEqual(["30.12.2020", "31.12.2020", "01.01.2021", "02.01.2021"]);
});

test("returns single date if start same as end", () => {
  expect(
    createDatesListRecursive([], "30.12.2020", "30.12.2020")
  ).toStrictEqual(["30.12.2020"]);
});

test("returns empty if start later than end", () => {
  expect(
    createDatesListRecursive([], "02.01.2021", "30.12.2020")
  ).toStrictEqual([]);
});
