import _ from "lodash";

export const uniquePropertyValuesSorted = (data, key) =>
  _.uniq(data.map(object => object[key]))
    .filter(object => object !== undefined)
    .sort();
