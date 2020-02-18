import React from 'react';
import _ from 'lodash'
import { csv } from 'd3'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Chip, Container, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import './App.css';

// Utilities ------------------------------------

const toTwoDigitString = (number) => {
  return number < 10 ? '0' + number : number
}

const stringToDate = (string) => {
  const parts = _.split(string, '.')
  return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
}

const dateToString = (date) => {
  return toTwoDigitString(date.getDate()) + '.' + toTwoDigitString((date.getMonth() + 1)) + '.' + date.getFullYear()
}

const incrementDate = (date) => {
  date.setDate(date.getDate() + 1)
  return date;
}

const incrementDateString = (dateString) => {
  return dateToString(incrementDate(stringToDate(dateString)))
}

const AxisLabel = ({ axisType, x, y, width, height, rotation, stroke, children }) => {
  const isVert = axisType === 'yAxis'
  const cx = isVert ? x : x + (width / 2)
  const cy = isVert ? (height / 2) + y : y + height + 10
  const rot = rotation ? `${rotation} ${cx} ${cy}` : 0
  return (
    <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke} fill='#404E55'>
      {children}
    </text>
  )
}

// Components -----------------------------------

const FilterSelect = ({ name, items, selectedItems, onChange }) => {
  return (
    <FormControl style={{maxWidth: 'md'}}>
      <InputLabel id="label">{name}</InputLabel>
      <Select
        labelId="label"
        id="select"
        multiple
        style={{minWidth: '250px'}}
        value={selectedItems.length ? selectedItems : ["All"]}
        onChange={(event, child) => {
          onChange(
            child.props.value === "All" ? [] : _.remove(event.target.value, d => { return d !== "All" })
          )
        }}
        renderValue={selectedItems => (
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {selectedItems.map(value => (
              <Chip key={value} label={value} style={{margin: 2}} />
            ))}
          </div>
        )}
      >
        <MenuItem value="All">All</MenuItem>
        {items.map(d => {
          return (
            <MenuItem value={d} key={d}>{d}</MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

const DoubleLineChart = ({ data, key1, key2, width, height }) => {
  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{
        top: 20, right: 50, left: 30, bottom: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" label={
        <AxisLabel
          axisType="yAxis"
          x={25}
          y={height / 2 - 25}
          width={0}
          height={0}
          rotation={270}
        >{key1}</AxisLabel>
      } />
      <YAxis yAxisId="right" orientation="right" label={
        <AxisLabel
          axisType="yAxis"
          x={width - 20}
          y={height / 2 - 25}
          width={0}
          height={0}
          rotation={90}
        >{key2}</AxisLabel>
      } />
      <Tooltip />
      <Legend />
      <Line yAxisId="left" type="monotone" isAnimationActive={false} dataKey={key1} stroke="#EC6A2D" strokeWidth={2} />
      <Line yAxisId="right" type="monotone" isAnimationActive={false} dataKey={key2} stroke="#404E55" strokeWidth={2} />
    </LineChart>
  )
}

// App ------------------------------------------

const createDatesMapRecursive = (datesMap, currentDate, lastDate) => {
  datesMap[currentDate] = { name: currentDate }
  if (currentDate !== lastDate)
  {
    createDatesMapRecursive(datesMap, incrementDateString(currentDate), lastDate)
  }
  return datesMap;
}

// returns an array of all Dates with 'Clicks' and 'Impressions' property if available for each Date
const createChartData = (data, currentDataSources, currentCampaigns) => {
  let filteredData = data

  if (currentDataSources.length)
  {
    filteredData = filteredData.filter(d => _.includes(currentDataSources, d.Datasource))
  }

  if (currentCampaigns.length)
  {
    filteredData = filteredData.filter(d => _.includes(currentCampaigns, d.Campaign))
  }

  return _.map(_.reduce(
    filteredData,
    (dates, value, key) => {
      let date = dates[value.Date]

      if (value.Clicks.length)
      {
        if (!date.Clicks)
        {
          date.Clicks = 0;
        }

        date.Clicks += Number.parseInt(value.Clicks)
      }

      if (value.Impressions.length)
      {
        if (!date.Impressions)
        {
          date.Impressions = 0;
        }

        date.Impressions += Number.parseInt(value.Impressions)
      }

      return dates
    },
    data.length ? createDatesMapRecursive({}, _.first(data).Date, _.last(data).Date) : {}
  ), d => d)
}

const filterByPropertyValue = (data, key, values) => {
  return values.length ? data.filter(d => _.includes(values, d[key])) : data;
}

const uniquePropertyValuesSorted = (data, key) => {
  return _.uniq(data.map(d => d[key])).sort()
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

  // filter data by selected Datasources and Campaigns
  const chartData = React.useMemo(
    () => {
      return createChartData(data, currentDataSources, currentCampaigns)
    },
    [data, currentDataSources, currentCampaigns]
  )

  // only show Datasources for selection that are present in the selected Campaigns
  const availableDataSources = React.useMemo(() => {
      return uniquePropertyValuesSorted(filterByPropertyValue(data, "Campaign", currentCampaigns), "Datasource")
    },
    [data, currentCampaigns]
  )

  // only show Campaigns for selection that are present in the selected Datasources
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
