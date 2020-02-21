import _ from "lodash";

export const accumulatedNumberOrNaN = (list, key) => {
  if (_.findIndex(list, element => element[key]) !== -1) {
    return _.sumBy(list, element => {
      return element[key] && element[key].length ? Number.parseInt(element[key]) : 0;
    });
  }
  return NaN;
};
