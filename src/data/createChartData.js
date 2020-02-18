import _ from 'lodash'
import { stringToDate } from '../utilities/stringToDate.js'
import { accumulatedNumberOrNaN } from './accumulatedNumberOrNaN.js'
import { createDatesListRecursive } from './createDatesListRecursive.js'

export const createChartData = (data, currentDataSources, currentCampaigns) => {
  const dates = _.map(_.groupBy(data, "Date"), d => {
    return {
      name: _.first(d).Date,
      Clicks : accumulatedNumberOrNaN(d, "Clicks"),
      Impressions : accumulatedNumberOrNaN(d, "Impressions")
    }
  })

  const allDates = data.length ? createDatesListRecursive([], _.first(data).Date, _.last(data).Date) : {}
  return _.sortBy(_.unionBy(dates, allDates, "name"), [d => stringToDate(d.name)]);
}
