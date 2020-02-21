import { toTwoDigitString } from "./toTwoDigitString.js";

export const dateToString = date =>
  toTwoDigitString(date.getDate()) +
  "." +
  toTwoDigitString(date.getMonth() + 1) +
  "." +
  date.getFullYear();
