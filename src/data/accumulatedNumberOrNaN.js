import _ from 'lodash'

export const accumulatedNumberOrNaN = (list, key) => {
  if (_.findIndex(list, e => e[key] ) !== -1)
  {
    return _.sumBy(list, e => { return e[key].length ? Number.parseInt(e[key]) : 0 })
  }
  return NaN
}
