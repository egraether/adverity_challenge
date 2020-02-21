import { uniquePropertyValuesSorted } from "./uniquePropertyValuesSorted.js";

test("filters to array of unique values sorted", () => {
  expect(
    uniquePropertyValuesSorted([{ a: 2 }, { a: 4 }, { a: 2 }, { a: 0 }], "a")
  ).toStrictEqual([0, 2, 4]);
});

test("filters to array of unique strings sorted", () => {
  expect(
    uniquePropertyValuesSorted(
      [{ a: "ink" }, { a: "bas" }, { a: "pre" }, { a: "bas" }],
      "a"
    )
  ).toStrictEqual(["bas", "ink", "pre"]);
});

test("filters all non-existent values and returns empty", () => {
  expect(
    uniquePropertyValuesSorted([{ a: 2 }, { a: 4 }, { a: 2 }, { a: 0 }], "b")
  ).toStrictEqual([]);
});

test("filters some non-existent values and returns the existing", () => {
  expect(
    uniquePropertyValuesSorted([{ a: 2 }, { b: 4 }, { b: 2 }, { a: 0 }], "b")
  ).toStrictEqual([2, 4]);
});
