import { filterByPropertyValue } from "./filterByPropertyValue.js";

test("leaves values unchanged on emtpy list", () => {
  expect(
    filterByPropertyValue(
      [{ a: "ink" }, { a: "bas" }, { a: "pre" }, { a: "bas" }],
      "a",
      []
    )
  ).toStrictEqual([{ a: "ink" }, { a: "bas" }, { a: "pre" }, { a: "bas" }]);
});

test("leaves values unchanged on non-existent key", () => {
  expect(
    filterByPropertyValue(
      [{ a: "ink" }, { a: "bas" }, { a: "pre" }, { a: "bas" }],
      "b",
      ["bas", "ink"]
    )
  ).toStrictEqual([{ a: "ink" }, { a: "bas" }, { a: "pre" }, { a: "bas" }]);
});

test("keeps objects matching from list in previous order", () => {
  expect(
    filterByPropertyValue(
      [{ a: "ink" }, { a: "bas" }, { a: "pre" }, { a: "bas" }],
      "a",
      ["bas", "ink"]
    )
  ).toStrictEqual([{ a: "ink" }, { a: "bas" }, { a: "bas" }]);
});
