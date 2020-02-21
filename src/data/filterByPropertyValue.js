import _ from "lodash";

export const filterByPropertyValue = (data, key, values) =>
  values.length && _.findIndex(data, object => object[key]) !== -1
    ? data.filter(object => _.includes(values, object[key]))
    : data;
