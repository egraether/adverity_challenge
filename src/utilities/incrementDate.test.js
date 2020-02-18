import { incrementDate } from './incrementDate.js'

test("increments date string", () => {
  const date = incrementDate(new Date(2020, 2, 17));
  expect(date.getDate()).toStrictEqual(18);
  expect(date.getMonth()).toStrictEqual(2);
  expect(date.getFullYear()).toStrictEqual(2020);
});

test("increments date string with month wrap", () => {
  const date = incrementDate(new Date(2020, 2, 31));
  expect(date.getDate()).toStrictEqual(1);
  expect(date.getMonth()).toStrictEqual(3);
  expect(date.getFullYear()).toStrictEqual(2020);
});

test("increments date string with year wrap", () => {
  const date = incrementDate(new Date(2020, 11, 31));
  expect(date.getDate()).toStrictEqual(1);
  expect(date.getMonth()).toStrictEqual(0);
  expect(date.getFullYear()).toStrictEqual(2021);
});
