import { toTwoDigitString } from "./toTwoDigitString.js";

export const dateToString = date => {
  return (
    toTwoDigitString(date.getDate()) +
    "." +
    toTwoDigitString(date.getMonth() + 1) +
    "." +
    date.getFullYear()
  );
};
