import _ from "lodash";
import { stringToDate } from "../utilities/stringToDate.js";
import { accumulatedNumberOrNaN } from "./accumulatedNumberOrNaN.js";
import { createDatesListRecursive } from "./createDatesListRecursive.js";

export const createChartData = data => {
  const dates = _.map(_.groupBy(data, "Date"), day => ({
    name: _.first(day).Date,
    Clicks: accumulatedNumberOrNaN(day, "Clicks"),
    Impressions: accumulatedNumberOrNaN(day, "Impressions")
  }));

  const allDates = data.length
    ? createDatesListRecursive([], _.first(data).Date, _.last(data).Date)
    : [];
  return _.sortBy(
    _.unionBy(
      dates,
      allDates.map(day => ({
        name: day
      })),
      "name"
    ),
    [day => stringToDate(day.name)]
  );
};
