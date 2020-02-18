import { stringToDate } from '../utilities/stringToDate.js'
import { incrementDateString } from '../utilities/incrementDateString.js'

export const createDatesListRecursive = (datesList, currentDate, lastDate) => {
  if (stringToDate(currentDate) <= stringToDate(lastDate))
  {
	datesList.push(currentDate);
    createDatesListRecursive(datesList, incrementDateString(currentDate), lastDate)
  }
  return datesList;
}
