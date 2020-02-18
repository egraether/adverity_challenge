import { dateToString } from "./dateToString.js";
import { stringToDate } from "./stringToDate.js";
import { incrementDate } from "./incrementDate.js";

export const incrementDateString = dateString => {
  return dateToString(incrementDate(stringToDate(dateString)));
};
