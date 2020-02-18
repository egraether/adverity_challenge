import _ from 'lodash'

export const filterByPropertyValue = (data, key, values) => {
  return values.length ? data.filter(d => _.includes(values, d[key])) : data;
}
