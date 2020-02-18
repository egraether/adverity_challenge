import { dateToString } from "./dateToString.js";

test("turns date to string", () => {
  expect(dateToString(new Date(2020, 2, 17))).toStrictEqual("17.03.2020");
});
