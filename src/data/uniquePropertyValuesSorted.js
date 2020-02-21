import _ from "lodash";

export const uniquePropertyValuesSorted = (data, key) =>
  _.uniq(data.map(d => d[key]))
    .filter(d => d !== undefined)
    .sort();
