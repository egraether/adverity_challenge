import _ from 'lodash'
import { incrementDateString } from '../utilities/incrementDateString.js'

export const createDatesListRecursive = (datesList, currentDate, lastDate) => {
  datesList.push({ name: currentDate });
  if (currentDate !== lastDate)
  {
    createDatesListRecursive(datesList, incrementDateString(currentDate), lastDate)
  }
  return datesList;
}
