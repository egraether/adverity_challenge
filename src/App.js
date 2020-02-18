import React from 'react';
import _ from 'lodash'
import { csv } from 'd3'
import { Container, Grid } from '@material-ui/core';
import { DoubleLineChart } from './components/DoubleLineChart.js'
import { FilterSelect } from './components/FilterSelect.js'
import { stringToDate } from './utilities/stringToDate.js'
import { incrementDateString } from './utilities/incrementDateString.js'
import './App.css';

// App ------------------------------------------

const filterByPropertyValue = (data, key, values) => {
  return values.length ? data.filter(d => _.includes(values, d[key])) : data;
}

const uniquePropertyValuesSorted = (data, key) => {
  return _.uniq(data.map(d => d[key])).sort()
}

const accumulatedNumberOrNaN = (list, key) => {
  if (_.findIndex(list, e => e[key] ) !== -1)
  {
    return _.sumBy(list, e => { return e[key].length ? Number.parseInt(e[key]) : 0 })
  }
  return NaN
}

const createDatesListRecursive = (datesList, currentDate, lastDate) => {
  datesList.push({ name: currentDate });
  if (currentDate !== lastDate)
  {
    createDatesListRecursive(datesList, incrementDateString(currentDate), lastDate)
  }
  return datesList;
}

const createChartData = (data, currentDataSources, currentCampaigns) => {
  const filteredData = filterByPropertyValue(
    filterByPropertyValue(
      data,
      "Datasource",
      currentDataSources
    ),
    "Campaign",
    currentCampaigns
  );

  const dates = _.map(_.groupBy(filteredData, "Date"), d => {
    return {
      name: _.first(d).Date,
      Clicks : accumulatedNumberOrNaN(d, "Clicks"),
      Impressions : accumulatedNumberOrNaN(d, "Impressions")
    }
  })

  const allDates = data.length ? createDatesListRecursive([], _.first(data).Date, _.last(data).Date) : {}
  return _.sortBy(_.unionBy(dates, allDates, "name"), [d => stringToDate(d.name)]);
}

const App = () => {
  const [data, setData] = React.useState([])
  const [currentDataSources, setCurrentDataSources] = React.useState([])
  const [currentCampaigns, setCurrentCampaigns] = React.useState([])

  React.useEffect(() => {
      (async () => {
        csv("data.csv").then(data => setData(data))
      })();
    },
    []
  )

  const chartData = React.useMemo(
    () => {
      return createChartData(data, currentDataSources, currentCampaigns)
    },
    [data, currentDataSources, currentCampaigns]
  )

  const availableDataSources = React.useMemo(() => {
      return uniquePropertyValuesSorted(filterByPropertyValue(data, "Campaign", currentCampaigns), "Datasource")
    },
    [data, currentCampaigns]
  )

  const availableCampaigns = React.useMemo(
    () => {
      return uniquePropertyValuesSorted(filterByPropertyValue(data, "Datasource", currentDataSources), "Campaign")
    },
    [data, currentDataSources]
  )

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item md={12}>
          <h1><span>Adverity</span> Advertising Data ETL-V Challenge</h1>
        </Grid>

        <Grid item md={12}>
          <DoubleLineChart data={chartData} key1="Clicks" key2="Impressions" width={960} height={400} />
        </Grid>

        <Grid item md={6}>
          <FilterSelect
            name="Datasource"
            items={availableDataSources}
            selectedItems={currentDataSources}
            onChange={values => setCurrentDataSources(values)}
          />
        </Grid>

        <Grid item md={6}>
          <FilterSelect
            name="Campaign"
            items={availableCampaigns}
            selectedItems={currentCampaigns}
            onChange={values => setCurrentCampaigns(values)}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App;
