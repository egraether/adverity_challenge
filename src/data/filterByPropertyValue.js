import _ from "lodash";

export const filterByPropertyValue = (data, key, values) => {
  return values.length && _.findIndex(data, d => d[key]) !== -1
    ? data.filter(d => _.includes(values, d[key]))
    : data;
};
