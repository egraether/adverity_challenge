import React from 'react';
import { csv } from 'd3'
import { Container, Grid } from '@material-ui/core';
import { DoubleLineChart } from './components/DoubleLineChart.js'
import { FilterSelect } from './components/FilterSelect.js'
import { createChartData } from './data/createChartData.js'
import { uniquePropertyValuesSorted } from './data/uniquePropertyValuesSorted.js'
import { filterByPropertyValue } from './data/filterByPropertyValue.js'
import './App.css';

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

  const chartData = React.useMemo(() => {
      return createChartData(
        filterByPropertyValue(
          filterByPropertyValue(
            data,
            "Datasource",
            currentDataSources
          ),
          "Campaign",
          currentCampaigns
        )
      )
    },
    [data, currentDataSources, currentCampaigns]
  )

  const availableDataSources = React.useMemo(() => {
      return uniquePropertyValuesSorted(filterByPropertyValue(data, "Campaign", currentCampaigns), "Datasource")
    },
    [data, currentCampaigns]
  )

  const availableCampaigns = React.useMemo(() => {
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
