import _ from 'lodash'

export const uniquePropertyValuesSorted = (data, key) => {
  return _.uniq(data.map(d => d[key])).sort()
}
