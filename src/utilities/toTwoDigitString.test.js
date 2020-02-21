import { toTwoDigitString } from "./toTwoDigitString.js";

test("adds leading zero to one positive digit number", () => {
  expect(toTwoDigitString(1)).toStrictEqual("01");
});

test("doesn't add leading zero to two digit number ", () => {
  expect(toTwoDigitString(10)).toStrictEqual("10");
});

test("doesn't add leading zero to three digit number ", () => {
  expect(toTwoDigitString(100)).toStrictEqual("100");
});

test("adds leading zero to zero", () => {
  expect(toTwoDigitString(0)).toStrictEqual("00");
});

test("doesn't add leading zero to negative single digit number", () => {
  expect(toTwoDigitString(-2)).toStrictEqual("-2");
});

test("doesn't add leading zero to negative two digit number", () => {
  expect(toTwoDigitString(-20)).toStrictEqual("-20");
});
