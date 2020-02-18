import { stringToDate } from './stringToDate.js'

test("parses date", () => {
  const date = stringToDate("17.03.2020");
  expect(date.getDate()).toStrictEqual(17);
  expect(date.getMonth()).toStrictEqual(2);
  expect(date.getFullYear()).toStrictEqual(2020);
});
