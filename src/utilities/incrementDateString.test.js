import { incrementDateString } from './incrementDateString.js'

test("increments date string", () => {
  expect(incrementDateString("17.03.2020")).toStrictEqual("18.03.2020");
});

test("increments date string with month wrap", () => {
  expect(incrementDateString("31.03.2020")).toStrictEqual("01.04.2020");
});

test("increments date string with year wrap", () => {
  expect(incrementDateString("31.12.2020")).toStrictEqual("01.01.2021");
});
